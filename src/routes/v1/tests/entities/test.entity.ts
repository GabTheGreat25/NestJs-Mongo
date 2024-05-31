import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { filterBadWords } from "src/utils";
import { Document } from "mongoose";
import { UploadImages } from "src/types";

@Schema({ timestamps: true })
export class Test extends Document {
  @ApiProperty({ description: "Test Message", example: "Test" })
  @Prop({
    required: true,
    validate: {
      validator: function (value: string) {
        return filterBadWords(value);
      },
      message: "Description contains inappropriate language.",
    },
  })
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
  @Prop({
    required: true,
  })
  image: UploadImages[];

  @ApiProperty({ description: "Deleted flag", example: false })
  @Prop({ default: false })
  deleted: boolean;
}

export const TestSchema = SchemaFactory.createForClass(Test);
