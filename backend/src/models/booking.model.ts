import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IBooking extends Document {
  _id: ObjectId;
  user: mongoose.Types.ObjectId;
  venue: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  advanceAmount: number;
  balanceDue: number;
  advancePaid: boolean;
  status:
    | "pending"
    | "advance_paid"
    | "balance_pending"
    | "fully_paid"
    | "cancelled";
  razorpayOrderId?: string;
  paymentId?: string;
  razorpayBalanceOrderId?: string;
  balancePaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    advanceAmount: { type: Number, required: true },
    balanceDue: { type: Number, required: true },
    advancePaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "pending",
        "advance_paid",
        "balance_pending",
        "fully_paid",
        "cancelled",
      ],
      default: "pending",
    },
    razorpayOrderId: { type: String, default: null },
    paymentId: { type: String, default: null },
    razorpayBalanceOrderId: { type: String, default: null },
    balancePaymentId: { type: String, default: null },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
