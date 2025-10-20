import { SchemaFactory } from "@nestjs/mongoose";
import { ROLE } from "src/constants";
import { User, UserSchema } from "../entities/user.entity";

export class Alumni extends User {}

export const AlumniSchema = UserSchema.discriminator(
  ROLE.ALUMNI,
  SchemaFactory.createForClass(Alumni),
);
