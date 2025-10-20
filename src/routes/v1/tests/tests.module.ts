import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  TestsChild,
  TestsChildSchema,
} from "../tests-child/entities/tests-child.entity";
import { TestsChildService } from "../tests-child/tests-child.service";
import { Test, TestSchema } from "./entities/test.entity";
import { TestsController } from "./tests.controller";
import { TestsService } from "./tests.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: TestsChild.name, schema: TestsChildSchema },
    ]),
  ],
  providers: [TestsService, TestsChildService],
  controllers: [TestsController],
})
export class TestsModule {}
