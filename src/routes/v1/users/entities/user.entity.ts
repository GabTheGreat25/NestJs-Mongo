import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { Document } from "mongoose";
import { ENV } from "src/config";
import { RESOURCE } from "src/constants";
import { UploadImages, VerifyCode } from "src/types";
@Schema({ timestamps: true, discriminatorKey: RESOURCE.ROLE })
export class User extends Document {
  @ApiProperty({ description: "User Name", example: "John Doe" })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: "User Email", example: "john.doe@gmail.com" })
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty({
    description: "User Password",
    example: "password",
  })
  @Prop({
    required: true,
    select: false,
    minlength: 6,
    set: (value: string) =>
      bcrypt.hashSync(value, bcrypt.genSaltSync(ENV.SALT_NUMBER)),
  })
  password: string;

  @ApiProperty({
    description: "Uploaded Images",
    example: [
      {
        public_id: "public_id",
        url: "url",
        originalname: "original_name",
      },
    ],
  })
  @Prop({
    required: true,
  })
  image: UploadImages[];

  @ApiProperty({
    description: "Verification code",
    example: {
      code: "123456",
      createdAt: "2025-10-14T13:30:00.000Z",
    },
    required: false,
    type: Object,
  })
  @Prop({
    type: {
      code: { type: String, required: false, default: null },
      createdAt: { type: Date, required: false, default: null },
    },
    required: false,
  })
  verificationCode?: VerifyCode;

  @ApiProperty({ description: "Deleted flag", example: false })
  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
