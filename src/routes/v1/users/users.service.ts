import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { RESOURCE, ROLE } from "src/constants";
import { Admin, Alumni, Student } from "./discriminators";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Alumni.name) private readonly alumniModel: Model<Alumni>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  getAll() {
    return this.userModel.find({ deleted: false });
  }

  getAllDeleted() {
    return this.userModel.find({ deleted: true });
  }

  getById(_id: string) {
    return this.userModel.findOne({ _id, deleted: false });
  }

  async getEmail(email: string) {
    return await this.userModel
      .findOne({ email, deleted: false })
      .select(RESOURCE.PASSWORD);
  }

  async add(createUserDto: CreateUserDto, session: ClientSession) {
    let modelToUse: Model<Admin> | Model<Alumni> | Model<Student>;

    if (createUserDto.role === ROLE.ADMIN) {
      modelToUse = this.adminModel;
    } else if (createUserDto.role === ROLE.ALUMNI) {
      modelToUse = this.alumniModel;
    } else modelToUse = this.studentModel;

    const newUser = new modelToUse(createUserDto);
    return await newUser.save({ session });
  }

  update(_id: string, updateUserDto: UpdateUserDto, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, {
      new: true,
      runValidators: true,
      session,
    });
  }

  deleteById(_id: string, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      _id,
      { deleted: true },
      { session },
    );
  }

  restoreById(_id: string, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      _id,
      { deleted: false },
      { session },
    );
  }

  forceDelete(_id: string, session: ClientSession) {
    return this.userModel.findByIdAndDelete(_id, { session });
  }

  changePassword(_id: string, newPassword: string, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      _id,
      { password: newPassword },
      {
        new: true,
        runValidators: true,
        select: RESOURCE.PASSWORD,
        deleted: false,
        session,
      },
    );
  }

  getCode(verificationCode: string) {
    return this.userModel.findOne({
      "verificationCode.code": verificationCode,
      deleted: false,
    });
  }

  async sendEmailOTP(email: string, otp: string, session: ClientSession) {
    return await this.userModel.findByIdAndUpdate(
      (await this.userModel.findOne({ email }))?._id,
      {
        $set: {
          verificationCode: { code: otp, createdAt: new Date().toISOString() },
        },
      },
      { new: true, runValidators: true, session },
    );
  }

  async resetPassword(
    verificationCode: string,
    newPassword: string,
    session: ClientSession,
  ) {
    return await this.userModel
      .findByIdAndUpdate(
        (
          await this.userModel.findOne({
            "verificationCode.code": verificationCode,
          })
        )?._id,
        {
          verificationCode: null,
          password: newPassword,
        },
        { new: true, runValidators: true, deleted: false, session },
      )
      .select(RESOURCE.PASSWORD)
      .lean();
  }
}
