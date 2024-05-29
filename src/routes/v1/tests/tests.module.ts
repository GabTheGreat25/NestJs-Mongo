import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestSchema } from "./entities/test.entity";
import { TestsService } from "./tests.service";
import { TestsController } from "./tests.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
