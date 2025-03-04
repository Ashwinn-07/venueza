import User, { IUser } from "../models/user.model";
import BaseRepository from "./base.repository";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }
}

export default UserRepository;
