import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { RESOURCE } from "src/constants";

@Schema({ timestamps: true, discriminatorKey: RESOURCE.ROLE })
export class User extends Document {
  @ApiProperty({ description: "User Name", example: "John Doe" })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: "User Email", example: "john.doe@gmail.com" })
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty({ description: "Deleted flag", example: false })
  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
