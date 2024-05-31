import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateUserDto {
  @ApiProperty({ description: "The name of the User", example: "Jhon Doe" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The email address of the User",
    example: "jhon.doe@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The role of the User", example: "Admin" })
  @IsNotEmpty()
  @IsString()
  role: string;

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
