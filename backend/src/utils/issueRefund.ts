import axios from "axios";

export const issueRefund = async (paymentId: string, amount: number) => {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay API keys are not configured.");
  }

  const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString(
    "base64"
  );

  try {
    const refundResponse = await axios.post(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      { amount },
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return refundResponse.data;
  } catch (error: any) {
    console.error(
      "Error issuing refund:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.description || "Failed to issue refund"
    );
  }
};
