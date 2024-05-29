import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTestDto {
  @ApiProperty({ description: "Test Message", example: "Test" })
  @IsNotEmpty()
  @IsString()
  message: string;
}
