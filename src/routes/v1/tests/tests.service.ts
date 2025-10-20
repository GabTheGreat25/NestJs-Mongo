import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { TestsChild } from "../tests-child/entities/tests-child.entity";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";
import { Test } from "./entities/test.entity";

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private readonly testModel: Model<Test>,
    @InjectModel(TestsChild.name)
    private readonly testsChildModel: Model<TestsChild>,
  ) {}

  getAll() {
    return this.testModel.find({ deleted: false });
  }

  getAllDeleted() {
    return this.testModel.find({ deleted: true });
  }

  getById(_id: string) {
    return this.testModel.findOne({ _id, deleted: false });
  }

  add(createTestDto: CreateTestDto, session: ClientSession) {
    return this.testModel.create([createTestDto], { session });
  }

  update(_id: string, updateTestDto: UpdateTestDto, session: ClientSession) {
    return this.testModel.findByIdAndUpdate(_id, updateTestDto, {
      new: true,
      runValidators: true,
      session,
    });
  }

  async deleteById(_id: string, session: ClientSession) {
    return Promise.all([
      this.testsChildModel.updateMany(
        { test: _id },
        { deleted: true },
        { session },
      ),
    ]).then(() =>
      this.testModel.findByIdAndUpdate(_id, { deleted: true }, { session }),
    );
  }

  async restoreById(_id: string, session: ClientSession) {
    return Promise.all([
      this.testsChildModel.updateMany(
        { test: _id },
        { deleted: false },
        { session },
      ),
    ]).then(() =>
      this.testModel.findByIdAndUpdate(_id, { deleted: false }, { session }),
    );
  }

  async forceDelete(_id: string, session: ClientSession) {
    return Promise.all([
      this.testsChildModel.deleteMany({ test: _id }, { session }),
    ]).then(() => this.testModel.findByIdAndDelete(_id, { session }));
  }
}
