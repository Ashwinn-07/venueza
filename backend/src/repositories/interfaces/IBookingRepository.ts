import { IBaseRepository } from "./IBaseRepository";
import { IBooking } from "../../models/booking.model";

export interface IBookingRepository extends IBaseRepository<IBooking> {
  findByUser(userId: string): Promise<IBooking[]>;
  findByVenue(venueId: string): Promise<IBooking[]>;
  findByVendor(vendorId: string): Promise<IBooking[]>;
  findByIdPopulated(bookingId: string): Promise<IBooking | null>;
  findAll(): Promise<IBooking[]>;
  getTotalCommission(): Promise<number>;
}
