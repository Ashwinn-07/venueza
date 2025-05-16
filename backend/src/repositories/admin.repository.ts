import { IAdminRepository } from "./interfaces/IAdminRepository";
import { BaseRepository } from "./base.repository";
import Admin, { IAdmin } from "../models/admin.model";
import { injectable } from "tsyringe";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email: email });
  }
}
