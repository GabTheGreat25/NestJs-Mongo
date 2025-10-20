import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PATH, RESOURCE, STATUSCODE } from "src/constants";
import { SessionRequest } from "src/types";
import { multipleImages, responseHandler } from "src/utils";
import { CreateTestsChildDto } from "./dto/create-tests-child.dto";
import { UpdateTestsChildDto } from "./dto/update-tests-child.dto";
import { TestsChild } from "./entities/tests-child.entity";
import { TestsChildService } from "./tests-child.service";

@ApiTags()
@Controller()
export class TestsChildController {
  constructor(private readonly service: TestsChildService) {}

  @Get()
  @ApiCreatedResponse({
    description: "All TestsChild retrieved successfully",
    type: TestsChild,
  })
  async getTestsChild() {
    const data = await this.service.getAll();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No TestsChild found"
        : "All TestsChild retrieved successfully",
    );
  }

  @Get(PATH.DELETED)
  @ApiCreatedResponse({
    description: "All Deleted TestsChild retrieved successfully",
    type: TestsChild,
  })
  async getDeletedTestsChild() {
    const data = await this.service.getAllDeleted();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted TestsChild found"
        : "All Deleted TestsChild retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @ApiCreatedResponse({
    description: "TestChild retrieved successfully",
    type: TestsChild,
  })
  async getTestChildById(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.getById(_id);
    return responseHandler(
      data,
      !data ? "No TestChild found" : "TestChild retrieved successfully",
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  @ApiCreatedResponse({
    description: "TestChild created successfully",
    type: TestsChild,
  })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async createTestChild(
    @Body() createTestsChildDto: CreateTestsChildDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const uploadedImages = await multipleImages(files, []);
    createTestsChildDto.image = uploadedImages;

    const data = await this.service.add(
      createTestsChildDto,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler([data], "TestChild created successfully");
  }

  @Patch(PATH.EDIT)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  @ApiCreatedResponse({
    description: "TestChild updated successfully",
    type: TestsChild,
  })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async updateTestChild(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateTestsChildDto: UpdateTestsChildDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const oldData = await this.service.getById(_id);

    const oldPublicIds =
      oldData[0]?.image.map((img: { public_id: string }) => img.public_id) ||
      [];

    const uploadNewImages = await Promise.all(
      files.map((file) => multipleImages([file], oldPublicIds)),
    );

    updateTestsChildDto.image = uploadNewImages.flat();

    const data = await this.service.update(
      _id,
      updateTestsChildDto,
      (req as unknown as SessionRequest).session,
    );

    return responseHandler([data], "TestChild updated successfully");
  }

  @Delete(PATH.DELETE)
  @ApiCreatedResponse({
    description: "TestChild deleted successfully",
    type: TestsChild,
  })
  async deleteTestChild(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.deleteById(
      _id,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted
        ? "TestChild is already deleted"
        : "TestChild deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  @ApiCreatedResponse({
    description: "TestChild restored successfully",
    type: TestsChild,
  })
  async restoreTestChild(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.restoreById(
      _id,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted
        ? "TestChild is not deleted"
        : "TestChild restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  @ApiCreatedResponse({
    description: "TestChild force deleted successfully",
    type: TestsChild,
  })
  async forceDeleteTestChild(
    @Param(RESOURCE.ID) _id: string,
    @Req() req: Request,
  ) {
    const data = await this.service.forceDelete(
      _id,
      (req as unknown as SessionRequest).session,
    );
    const message = !data
      ? "No TestChild found"
      : "TestChild force deleted successfully";
    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );
    return responseHandler(data, message);
  }
}
