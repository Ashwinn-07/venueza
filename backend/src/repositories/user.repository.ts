import User, { IUser } from "../models/user.model";
import { IUserRepository } from "./interfaces/IUserRepository";
import { BaseRepository } from "./base.repository";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email });
  }

  async findBySearchTerm(search: string): Promise<IUser[]> {
    if (!search) {
      return await User.find({});
    }

    return await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
  }
}
