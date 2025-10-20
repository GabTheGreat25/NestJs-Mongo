import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestDto {
  @ApiProperty({ description: "Test Message", example: "Test" })
  @IsNotEmpty()
  @IsString()
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
