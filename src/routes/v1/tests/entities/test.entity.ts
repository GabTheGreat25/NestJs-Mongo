import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { filterBadWords } from "src/utils";
import { Document } from "mongoose";

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

  @ApiProperty({ description: "Deleted flag", example: false })
  @Prop({ default: false })
  deleted: boolean;
}

export const TestSchema = SchemaFactory.createForClass(Test);
