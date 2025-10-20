import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";
import { CreateTestDto } from "./create-test.dto";

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @ApiProperty({ description: "Test Message", example: "Test" })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: "Uploaded Images",
    example: [
      { public_id: "public_id", url: "url", originalname: "original_name" },
    ],
  })
  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
