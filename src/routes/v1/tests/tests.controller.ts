import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
  Put,
  Delete,
} from "@nestjs/common";
import { TestsService } from "./tests.service";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";
import { responseHandler } from "src/utils";
import { STATUSCODE, PATH, RESOURCE } from "src/constants";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Test } from "../tests/entities/test.entity";

@ApiTags()
@Controller()
export class TestsController {
  constructor(private readonly service: TestsService) {}

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
  @ApiCreatedResponse({
    description: "Test created successfully",
    type: Test,
  })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async createTest(@Body() createTestDto: CreateTestDto) {
    const data = await this.service.add(createTestDto);
    return responseHandler([data], "Test created successfully");
  }

  @Patch(PATH.EDIT)
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({
    description: "Test updated successfully",
    type: Test,
  })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async updateTest(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    const data = await this.service.update(_id, updateTestDto);
    return responseHandler([data], "Test updated successfully");
  }

  @Delete(PATH.DELETE)
  @ApiCreatedResponse({
    description: "Test deleted successfully",
    type: Test,
  })
  async deleteTest(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.deleteById(_id);
    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "Test is already deleted" : "Test deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  @ApiCreatedResponse({
    description: "Test restored successfully",
    type: Test,
  })
  async restoreTest(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.restoreById(_id);
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
  async forceDeleteTest(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.forceDelete(_id);
    const message = !data ? "No Test found" : "Test force deleted successfully";
    return responseHandler(data, message);
  }
}
