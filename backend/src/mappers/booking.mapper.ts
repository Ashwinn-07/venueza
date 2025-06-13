import { IBooking } from "../models/booking.model";
import {
  BookingResponseDto,
  DashboardDataResponseDto,
  RevenueResponseDto,
  TransactionHistoryDto,
} from "../dto/booking.dto";

export class BookingMapper {
  static toResponseDto(booking: IBooking): BookingResponseDto {
    return {
      id: booking._id.toString(),
      userId: booking.user.toString(),
      venueId: booking.venue.toString(),
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
      advanceAmount: booking.advanceAmount,
      balanceDue: booking.balanceDue,
      status: booking.status,
      razorpayOrderId: booking.razorpayOrderId,
      paymentId: booking.paymentId,
      razorpayBalanceOrderId: booking.razorpayBalanceOrderId,
      balancePaymentId: booking.balancePaymentId,
      commissionAmount: booking.commissionAmount,
      vendorReceives: booking.vendorReceives,
      refundId: booking.refundId,
      cancellationReason: booking.cancellationReason,
    };
  }

  static toDashboardResponse(data: any): DashboardDataResponseDto {
    return {
      totalBookings: data.totalBookings,
      vendorRevenue: data.vendorRevenue,
      upcomingBookings: data.upcomingBookings,
      monthlyRevenue: data.monthlyRevenue.map((r: any) => ({
        month: r.month,
        revenue: r.revenue,
      })),
    };
  }

  static toRevenueResponse(revenues: any[]): RevenueResponseDto[] {
    return revenues.map((r) => ({
      month: r.month,
      revenue: r.revenue,
    }));
  }

  static toTransactionHistoryDto(transaction: any): TransactionHistoryDto {
    return {
      bookingId: transaction.bookingId,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
    };
  }
}
