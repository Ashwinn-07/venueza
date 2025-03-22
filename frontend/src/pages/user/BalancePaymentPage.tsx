import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useRazorpayScript } from "../../hooks/useRazorpayScript";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const BalancePaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookingById, createBalancePaymentOrder, verifyBalancePayment } =
    useAuthStore();
  const isRazorpayLoaded = useRazorpayScript();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await getBookingById(id);
        setBooking(response.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingData();
  }, [id, getBookingById]);

  useEffect(() => {
    const initiateBalancePayment = async () => {
      if (!booking || !isRazorpayLoaded) return;

      if (!booking.razorpayBalanceOrderId) {
        try {
          const response = await createBalancePaymentOrder(booking._id);
          setBooking(response.booking);
        } catch (err) {
          console.error("Error creating balance payment order:", err);
          setError(
            "Failed to initiate balance payment. Please try again later."
          );
          return;
        }
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        amount: Math.round(booking.balanceDue * 100),
        currency: "INR",
        name: "venueza",
        description: `Balance payment`,
        order_id: booking.razorpayBalanceOrderId,
        handler: handlePaymentSuccess,
        theme: {
          color: "#2A9D8F",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response: any) => {
        console.error("Balance payment failed:", response);
        setError(response.error.description || "Balance payment failed");
        setPaymentStatus("failed");
      });

      razorpay.open();

      return () => {
        razorpay.close();
      };
    };

    initiateBalancePayment();
  }, [booking, isRazorpayLoaded, createBalancePaymentOrder]);

  const handlePaymentSuccess = async (response: any) => {
    try {
      setPaymentStatus("pending");
      const paymentData = {
        paymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      };

      setPaymentDetails(paymentData);

      const verificationResponse = await verifyBalancePayment(
        booking._id,
        paymentData
      );
      if (verificationResponse.booking) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");
        setError(
          "Balance payment verification failed. Please contact support."
        );
      }
    } catch (err) {
      console.error("Error verifying balance payment:", err);
      setPaymentStatus("failed");
      setError("Balance payment verification failed. Please contact support.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Loading balance payment details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Balance Payment</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {paymentStatus === "pending" && (
              <div className="text-center py-8">
                <div className="animate-pulse rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Processing Balance Payment
                </h2>
                <p className="text-gray-600">
                  Please wait while we verify your balance payment...
                </p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="text-center py-8">
                <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Balance Payment Successful
                </h2>
                <p className="text-gray-600 mb-6">
                  Your booking is now fully paid!
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                  <p className="font-medium">Payment Details</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <span className="text-gray-600">Payment ID:</span>
                    <span>{paymentDetails?.paymentId || "N/A"}</span>
                    <span className="text-gray-600">Booking ID:</span>
                    <span>{booking?._id || "N/A"}</span>
                    <span className="text-gray-600">Amount Paid:</span>
                    <span>₹{booking?.balanceDue || "0"}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/user/bookings")}
                  className="w-full bg-[#2A9D8F] text-white py-2 px-4 rounded-md hover:bg-[#264653] transition-colors cursor-pointer"
                >
                  View My Bookings
                </button>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="text-center py-8">
                <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Balance Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  {error ||
                    "There was an issue processing your balance payment."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancePaymentPage;
