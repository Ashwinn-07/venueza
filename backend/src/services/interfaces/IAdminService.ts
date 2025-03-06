import { IAdmin } from "../../models/admin.model";

export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ admin: IAdmin; token: string }>;
}
