import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { ClientSession, Model } from "mongoose";
import { RESOURCE } from "src/constants";
import { lookup, multipleImages } from "src/utils";
import { CreateTestsChildDto } from "./dto/create-tests-child.dto";
import { UpdateTestsChildDto } from "./dto/update-tests-child.dto";
import { TestsChild } from "./entities/tests-child.entity";

@Injectable()
export class TestsChildService {
  constructor(
    @InjectModel(TestsChild.name)
    private readonly testsChildModel: Model<TestsChild>,
  ) {}

  getAll() {
    return this.testsChildModel
      .aggregate()
      .match({ deleted: false })
      .append(
        lookup({
          from: RESOURCE.TESTS,
          localField: RESOURCE.TEST,
          as: RESOURCE.TEST,
          pipeline: [],
        }),
      );
  }

  getAllDeleted() {
    return this.testsChildModel
      .aggregate()
      .match({ deleted: true })
      .append(
        lookup({
          from: RESOURCE.TESTS,
          localField: RESOURCE.TEST,
          as: RESOURCE.TEST,
          pipeline: [],
        }),
      );
  }

  getById(_id: string) {
    return this.testsChildModel
      .aggregate()
      .match({ _id: new mongoose.Types.ObjectId(_id), deleted: false })
      .append(
        lookup({
          from: RESOURCE.TESTS,
          localField: RESOURCE.TEST,
          as: RESOURCE.TEST,
          pipeline: [],
        }),
      );
  }

  add(createTestsChildDto: CreateTestsChildDto, session: ClientSession) {
    return this.testsChildModel.create([createTestsChildDto], { session });
  }

  update(
    _id: string,
    updateTestsChildDto: UpdateTestsChildDto,
    session: ClientSession,
  ) {
    return this.testsChildModel.findByIdAndUpdate(_id, updateTestsChildDto, {
      new: true,
      runValidators: true,
      session,
    });
  }

  deleteById(_id: string, session: ClientSession) {
    return this.testsChildModel.findByIdAndUpdate(
      _id,
      { deleted: true },
      { session },
    );
  }

  restoreById(_id: string, session: ClientSession) {
    return this.testsChildModel.findByIdAndUpdate(
      _id,
      { deleted: false },
      { session },
    );
  }

  forceDelete(_id: string, session: ClientSession) {
    return this.testsChildModel.findByIdAndDelete(_id, { session });
  }

  deleteChildImagesByTestId(_id: string) {
    return this.testsChildModel
      .find({ test: _id })
      .lean()
      .then((children) =>
        multipleImages(
          [],
          children
            .flatMap((child) => child.image?.map((img) => img.public_id))
            .filter(Boolean),
        ),
      );
  }
}
