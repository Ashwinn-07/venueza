import { IBaseRepository } from "./IBaseRepository";
import { IBooking } from "../../models/booking.model";

export interface IBookingRepository extends IBaseRepository<IBooking> {
  findByUser(userId: string): Promise<IBooking[]>;
  findByVenue(venueId: string): Promise<IBooking[]>;
}
