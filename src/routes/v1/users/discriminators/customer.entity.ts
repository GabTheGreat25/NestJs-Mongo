import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { User, UserSchema } from "../entities/user.entity";
import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE } from "../../../../constants";
import { filterBadWords } from "../../../../utils";

@Schema()
export class Customer extends User {
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

export const CustomerSchema = UserSchema.discriminator(
  ROLE.CUSTOMER,
  SchemaFactory.createForClass(Customer),
);
