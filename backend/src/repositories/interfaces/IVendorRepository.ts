import { IBaseRepository } from "./IBaseRepository";
import { IVendor } from "../../models/vendor.model";

export interface IVendorRepository extends IBaseRepository<IVendor> {
  findByEmail(email: string): Promise<IVendor | null>;
}
