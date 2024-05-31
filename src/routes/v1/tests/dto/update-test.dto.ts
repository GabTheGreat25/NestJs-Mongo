import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateTestDto } from "./create-test.dto";
import { UploadImages } from "src/types";

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @ApiProperty({
    description: "Test Message",
    example: "Test",
  })
  @IsString()
  @IsNotEmpty()
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
