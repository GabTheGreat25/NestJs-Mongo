import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateTestDto } from "./create-test.dto";

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @ApiProperty({
    description: "Test Message",
    example: "Test",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
