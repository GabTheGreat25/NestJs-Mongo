import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: "The email address of the User",
    example: "jhon.doe@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User Password",
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
