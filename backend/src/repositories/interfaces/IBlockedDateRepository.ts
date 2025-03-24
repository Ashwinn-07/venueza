import { IBaseRepository } from "./IBaseRepository";
import { IBlockedDate } from "../../models/blockedDate.model";

export interface IBlockedDateRepository extends IBaseRepository<IBlockedDate> {
  findBlockedDatesByVenue(venueId: string): Promise<IBlockedDate[]>;
  createBlockedDate(data: {
    venue: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }): Promise<IBlockedDate>;
}
