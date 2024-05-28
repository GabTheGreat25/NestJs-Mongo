import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
@Schema()
export class User {
  @ApiProperty({ description: "User Name", example: "Jhon Doe" })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: "User Email", example: "jhon.doe@gmail.com" })
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty({ description: "Deleted flag", example: false })
  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
