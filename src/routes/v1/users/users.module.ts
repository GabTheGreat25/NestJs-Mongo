import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Admin,
  AdminSchema,
  Alumni,
  AlumniSchema,
  Student,
  StudentSchema,
} from "./discriminators";
import { User, UserSchema } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Alumni.name, schema: AlumniSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
