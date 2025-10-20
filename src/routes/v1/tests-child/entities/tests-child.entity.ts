import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Schema as MongooseSchema } from "mongoose";
import { UploadImages } from "src/types";
import { filterBadWords } from "src/utils";

@Schema({ timestamps: true })
export class TestsChild extends Document {
  @ApiProperty({ description: "Test Parent", example: "1" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Test", required: true })
  test: MongooseSchema.Types.ObjectId;

  @ApiProperty({ description: "Test Child Message", example: "Test Child" })
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
      { public_id: "public_id", url: "url", originalname: "original_name" },
    ],
  })
  @Prop({ required: true })
  image: UploadImages[];

  @ApiProperty({ description: "Deleted flag", example: false })
  @Prop({ default: false })
  deleted: boolean;
}

export const TestsChildSchema = SchemaFactory.createForClass(TestsChild);
