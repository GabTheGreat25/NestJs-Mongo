import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Test } from "./entities/test.entity";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";

@Injectable()
export class TestsService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}

  getAll() {
    return this.testModel.find({ deleted: false });
  }

  getAllDeleted() {
    return this.testModel.find({ deleted: true });
  }

  getById(_id: string) {
    return this.testModel.findOne({ _id, deleted: false });
  }

  add(createTestDto: CreateTestDto) {
    return this.testModel.create(createTestDto);
  }

  update(_id: string, updateTestDto: UpdateTestDto) {
    return this.testModel.findByIdAndUpdate(_id, updateTestDto, { new: true });
  }

  deleteById(_id: string) {
    return this.testModel.findByIdAndUpdate(_id, { deleted: true });
  }

  restoreById(_id: string) {
    return this.testModel.findByIdAndUpdate(_id, { deleted: false });
  }

  forceDelete(_id: string) {
    return this.testModel.findByIdAndDelete(_id);
  }
}
