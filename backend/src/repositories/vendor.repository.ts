import Vendor, { IVendor } from "../models/vendor.model";
import BaseRepository from "./base.repository";

class VendorRepository extends BaseRepository<IVendor> {
  constructor() {
    super(Vendor);
  }
}
export default VendorRepository;
