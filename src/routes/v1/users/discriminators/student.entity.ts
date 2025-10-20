import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE } from "src/constants";
import { filterBadWords } from "src/utils";
import { User, UserSchema } from "../entities/user.entity";

@Schema()
export class Student extends User {
  @ApiProperty({
    description: "User Description",
    example: "Full Stack Developer",
  })
  @Prop({
    required: true,
    validate: {
      validator: function (value: string) {
        return filterBadWords(value);
      },
      message: "Description contains inappropriate language.",
    },
  })
  description: string;
}

export const StudentSchema = UserSchema.discriminator(
  ROLE.STUDENT,
  SchemaFactory.createForClass(Student),
);
