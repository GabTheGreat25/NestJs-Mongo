import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UploadImages } from "src/types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: "The name of the User",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The email address of the User",
    example: "john.doe@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User Password",
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
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
  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
