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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { responseHandler } from "../utils/index";
import { STATUSCODE } from "../constants/index";
import { RESOURCE, PATH } from "../constants/index";

@Controller(RESOURCE.USERS)
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  async getUsers() {
    const data = await this.service.getAll();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Users found"
        : "All Users retrieved successfully",
    );
  }

  @Get(PATH.DELETED)
  async getDeletedUsers() {
    const data = await this.service.getAllDeleted();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted Users found"
        : "All Deleted Users retrieved successfully",
    );
  }

  @Get(PATH.ID)
  async getUserById(@Param("id") _id: string) {
    const data = await this.service.getById(_id);
    return responseHandler(
      data,
      !data ? "No User found" : "User retrieved successfully",
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const data = await this.service.add(createUserDto);
    return responseHandler([data], "User created successfully");
  }

  @Patch(PATH.EDIT)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param("id") _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.service.update(_id, updateUserDto);
    return responseHandler([data], "User updated successfully");
  }

  @Delete(PATH.DELETE)
  async deleteUser(@Param("id") _id: string) {
    const data = await this.service.deleteById(_id);
    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "User is already deleted" : "User deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  async restoreUser(@Param("id") _id: string) {
    const data = await this.service.restoreById(_id);
    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted ? "User is not deleted" : "User restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  async forceDeleteUser(@Param("id") _id: string) {
    const data = await this.service.forceDelete(_id);
    const message = !data ? "No User found" : "User force deleted successfully";
    return responseHandler(data, message);
  }
}
