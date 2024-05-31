import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateTestsChildDto } from "./create-tests-child.dto";
import { UploadImages } from "src/types";

export class UpdateTestsChildDto extends PartialType(CreateTestsChildDto) {
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
