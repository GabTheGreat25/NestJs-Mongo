import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestsChildDto {
  @ApiProperty({ description: "Test Parent", example: "1" })
  @IsNotEmpty()
  @IsMongoId()
  test: string;

  @ApiProperty({ description: "Test Child Message", example: "Test Child" })
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
