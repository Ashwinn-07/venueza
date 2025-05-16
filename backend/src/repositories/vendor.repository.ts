import Vendor, { IVendor } from "../models/vendor.model";
import { IVendorRepository } from "./interfaces/IVendorRepository";
import { BaseRepository } from "./base.repository";
import { injectable } from "tsyringe";

@injectable()
export class VendorRepository
  extends BaseRepository<IVendor>
  implements IVendorRepository
{
  constructor() {
    super(Vendor);
  }

  async findByEmail(email: string): Promise<IVendor | null> {
    return await Vendor.findOne({ email: email });
  }
}
