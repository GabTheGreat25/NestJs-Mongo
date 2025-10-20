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
import { TestsChildService } from "../tests-child/tests-child.service";
import { Test } from "../tests/entities/test.entity";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";
import { TestsService } from "./tests.service";

@ApiTags()
@Controller()
export class TestsController {
  constructor(
    private readonly service: TestsService,
    private readonly testsChildService: TestsChildService,
  ) {}

  @Get()
  @ApiCreatedResponse({
    description: "All Tests retrieved successfully",
    type: Test,
  })
  async getTests() {
    const data = await this.service.getAll();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Tests found"
        : "All Tests retrieved successfully",
    );
  }

  @Get(PATH.DELETED)
  @ApiCreatedResponse({
    description: "All Deleted Tests retrieved successfully",
    type: Test,
  })
  async getDeletedTests() {
    const data = await this.service.getAllDeleted();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted Tests found"
        : "All Deleted Tests retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @ApiCreatedResponse({
    description: "Test retrieved successfully",
    type: Test,
  })
  async getTestById(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.getById(_id);
    return responseHandler(
      data,
      !data ? "No Test found" : "Test retrieved successfully",
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  @ApiCreatedResponse({ description: "Test created successfully", type: Test })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async createTest(
    @Body() createTestDto: CreateTestDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const uploadedImages = await multipleImages(files, []);
    createTestDto.image = uploadedImages;

    const data = await this.service.add(
      createTestDto,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler([data], "Test created successfully");
  }

  @Patch(PATH.EDIT)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  @ApiCreatedResponse({ description: "Test updated successfully", type: Test })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async updateTest(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateTestDto: UpdateTestDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const oldData = await this.service.getById(_id);

    const oldPublicIds = oldData?.image.map((img) => img.public_id) || [];

    const uploadNewImages = await Promise.all(
      files.map((file) => multipleImages([file], oldPublicIds)),
    );

    updateTestDto.image = uploadNewImages.flat();

    const data = await this.service.update(
      _id,
      updateTestDto,
      (req as unknown as SessionRequest).session,
    );

    return responseHandler([data], "Test updated successfully");
  }

  @Delete(PATH.DELETE)
  @ApiCreatedResponse({ description: "Test deleted successfully", type: Test })
  async deleteTest(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.deleteById(
      _id,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "Test is already deleted" : "Test deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  @ApiCreatedResponse({ description: "Test restored successfully", type: Test })
  async restoreTest(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.restoreById(
      _id,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted ? "Test is not deleted" : "Test restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  @ApiCreatedResponse({
    description: "Test force deleted successfully",
    type: Test,
  })
  async forceDeleteTest(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    await this.testsChildService.deleteChildImagesByTestId(_id);

    const data = await this.service.forceDelete(
      _id,
      (req as unknown as SessionRequest).session,
    );
    const message = !data ? "No Test found" : "Test force deleted successfully";
    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );
    return responseHandler(data, message);
  }
}
