import { IBaseRepository } from "./IBaseRepository";
import { IAdmin } from "../../models/admin.model";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}
