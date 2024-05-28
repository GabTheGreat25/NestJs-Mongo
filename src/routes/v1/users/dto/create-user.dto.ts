import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
}
