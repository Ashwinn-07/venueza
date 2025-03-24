import { IBlockedDateRepository } from "./interfaces/IBlockedDateRepository";
import BaseRepository from "./base.repository";
import BlockedDate, { IBlockedDate } from "../models/blockedDate.model";

class BlockedDateRepository
  extends BaseRepository<IBlockedDate>
  implements IBlockedDateRepository
{
  constructor() {
    super(BlockedDate);
  }

  async findBlockedDatesByVenue(venueId: string): Promise<IBlockedDate[]> {
    return await BlockedDate.find({ venue: venueId }).exec();
  }
  async createBlockedDate(data: {
    venue: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }): Promise<IBlockedDate> {
    return await BlockedDate.create(data);
  }
}

export default new BlockedDateRepository();
