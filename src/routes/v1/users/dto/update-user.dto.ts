import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { UploadImages } from "src/types";

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
    description: "Uploaded Images",
    example: [
      {
        public_id: "public_id",
        url: "url",
        originalname: "originalname",
      },
    ],
  })
  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
