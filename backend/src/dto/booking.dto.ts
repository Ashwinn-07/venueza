export class CreateBookingRequestDto {
  venueId!: string;
  startDate!: Date;
  endDate!: Date;
  totalPrice!: number;
}

export class VerifyPaymentRequestDto {
  bookingId!: string;
  paymentId!: string;
  razorpaySignature!: string;
}

export class BalancePaymentRequestDto {
  bookingId!: string;
}

export class BookingResponseDto {
  id!: string;
  userId!: string;
  venueId!: string;
  startDate!: Date;
  endDate!: Date;
  totalPrice!: number;
  advanceAmount!: number;
  balanceDue!: number;
  status!: string;
  razorpayOrderId?: string;
  paymentId?: string;
  razorpayBalanceOrderId?: string;
  balancePaymentId?: string;
  commissionAmount?: number;
  vendorReceives?: number;
  refundId?: number;
  cancellationReason?: string;
  user?: {
    name: string;
    email?: string;
  };
  venue?: {
    name: string;
    location?: string;
    images?: string[];
    address?: string;
  };
}

export class CreateBookingResponseDto {
  message!: string;
  booking!: BookingResponseDto;
  razorpayOrder!: any;
}

export class VerifyPaymentResponseDto {
  message!: string;
  booking!: BookingResponseDto;
}

export class BookingsListResponseDto {
  message!: string;
  bookings!: BookingResponseDto[];
}

export class BookedDatesResponseDto {
  startDate!: Date;
  endDate!: Date;
}

export class AddBlockedDateRequestDto {
  venueId!: string;
  startDate!: Date;
  endDate!: Date;
  reason?: string;
}

export class AddBlockedDateResponseDto {
  message!: string;
  blockedDate!: any;
}

export class CancelBookingRequestDto {
  bookingId!: string;
  cancellationReason?: string;
}

export class RevenueResponseDto {
  month!: number;
  revenue!: number;
}

export class DashboardDataResponseDto {
  totalBookings!: number;
  vendorRevenue!: number;
  upcomingBookings!: number;
  monthlyRevenue!: RevenueResponseDto[];
}

export class TransactionHistoryDto {
  bookingId!: string;
  totalPrice!: number;
  advanceAmount!: number;
  balanceDue!: number;
  commission!: number;
  bookingDate!: Date;
}

export class TransactionHistoryResponseDto {
  message!: string;
  data!: TransactionHistoryDto[];
}
