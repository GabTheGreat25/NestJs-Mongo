import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getAll() {
    return this.userModel.find({ deleted: false });
  }

  getAllDeleted() {
    return this.userModel.find({ deleted: true });
  }

  getById(_id: string) {
    return this.userModel.findOne({ _id, deleted: false });
  }

  add(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, { new: true });
  }

  deleteById(_id: string) {
    return this.userModel.findByIdAndUpdate(_id, { deleted: true });
  }

  restoreById(_id: string) {
    return this.userModel.findByIdAndUpdate(_id, { deleted: false });
  }

  forceDelete(_id: string) {
    return this.userModel.findByIdAndDelete(_id);
  }
}
