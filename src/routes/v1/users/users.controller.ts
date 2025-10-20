import {
  BadRequestException,
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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { PATH, RESOURCE, ROLE, STATUSCODE } from "src/constants";
import { JwtAuthGuard, Roles, TokenService } from "src/middleware";
import { SessionRequest } from "src/types";
import {
  generateRandomCode,
  multipleImages,
  responseHandler,
  sendEmail,
} from "src/utils";
import { User } from "../users/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags()
@Controller()
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @ApiCreatedResponse({
    description: "All Users retrieved successfully",
    type: User,
  })
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
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @ApiCreatedResponse({
    description: "All Deleted Users retrieved successfully",
    type: User,
  })
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
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @ApiCreatedResponse({
    description: "User retrieved successfully",
    type: User,
  })
  async getUserById(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.getById(_id);
    return responseHandler(
      data,
      !data ? "No User found" : "User retrieved successfully",
    );
  }

  @Post(PATH.LOGIN)
  @ApiCreatedResponse({ description: "User login successfully", type: User })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async loginUser(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const data = await this.service.getEmail(email);

    if (!data) return responseHandler([], "No User found");

    if (!(await bcrypt.compare(password, data.password))) {
      return responseHandler([], "Password does not match");
    }

    const accessToken = this.jwtService.sign({ role: data[RESOURCE.ROLE] });
    this.tokenService.setToken(accessToken);

    return responseHandler(data, "User Login successfully", { accessToken });
  }

  @Post(PATH.LOGOUT)
  @ApiCreatedResponse({ description: "User logout successful" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async logoutUser() {
    const savedToken = this.tokenService.getToken();

    if (savedToken) this.tokenService.blacklistToken();

    return responseHandler([], "User logout successful");
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  @ApiCreatedResponse({ description: "User created successfully", type: User })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const uploadedImages = await multipleImages(files, []);
    createUserDto.image = uploadedImages;

    const data = await this.service.add(
      createUserDto,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler([data], "User created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.ALUMNI)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  @ApiCreatedResponse({ description: "User updated successfully", type: User })
  @ApiBadRequestResponse({ description: "Invalid Request" })
  async updateUser(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const oldData = await this.service.getById(_id);

    const oldPublicIds = oldData?.image.map((img) => img.public_id) || [];

    const uploadNewImages = await Promise.all(
      files.map((file) => multipleImages([file], oldPublicIds)),
    );

    updateUserDto.image = uploadNewImages.flat();

    const data = await this.service.update(
      _id,
      updateUserDto,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler([data], "User updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.ALUMNI)
  @ApiCreatedResponse({ description: "User deleted successfully", type: User })
  async deleteUser(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.deleteById(
      _id,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "User is already deleted" : "User deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.ALUMNI)
  @ApiCreatedResponse({ description: "User restored successfully", type: User })
  async restoreUser(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.restoreById(
      _id,
      (req as unknown as SessionRequest).session,
    );
    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted ? "User is not deleted" : "User restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.ALUMNI)
  @ApiCreatedResponse({
    description: "User force deleted successfully",
    type: User,
  })
  async forceDeleteUser(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.forceDelete(
      _id,
      (req as unknown as SessionRequest).session,
    );
    const message = !data ? "No User found" : "User force deleted successfully";
    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );
    return responseHandler(data, message);
  }

  @Patch(PATH.CHANGE_PASS)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.STUDENT)
  async changeUserPassword(
    @Param(RESOURCE.ID) _id: string,
    @Body() body: { newPassword: string; confirmPassword: string },
    @Req() req: Request,
  ) {
    const { newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword)
      throw new BadRequestException("Both passwords are required");

    if (newPassword !== confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const data = await this.service.changePassword(
      _id,
      newPassword,
      (req as unknown as SessionRequest).session,
    );

    return responseHandler([data], "Password changed successfully");
  }

  @Post(PATH.OTP)
  async sendUserEmailOTP(@Body() body: { email: string }, @Req() req: Request) {
    const existingEmail = await this.service.getEmail(body.email);

    const verificationCode = existingEmail.verificationCode;

    if (existingEmail.verificationCode)
      if (
        Date.now() - new Date(verificationCode.createdAt).getTime() <
        5 * 60 * 1000
      )
        throw new BadRequestException(
          "Please wait 5 minutes before requesting a new verification code.",
        );

    const code = generateRandomCode();
    await sendEmail(body.email, code);

    const data = await this.service.sendEmailOTP(
      body.email,
      code,
      (req as unknown as SessionRequest).session,
    );

    return responseHandler([data], "Email OTP sent successfully");
  }

  @Patch(PATH.RESTORE_PASS)
  async resetUserEmailPassword(
    @Body()
    body: {
      newPassword: string;
      confirmPassword: string;
      verificationCode: string;
    },
    @Req() req: Request,
  ) {
    if (
      !body.newPassword ||
      !body.confirmPassword ||
      body.newPassword !== body.confirmPassword
    )
      throw new BadRequestException("Passwords are required and must match");

    const code = await this.service.getCode(body.verificationCode);

    if (
      Date.now() - new Date(code.verificationCode.createdAt).getTime() >
      5 * 60 * 1000
    ) {
      code.verificationCode = null;
      await code.save();
      throw new BadRequestException("Verification code has expired");
    }

    const data = await this.service.resetPassword(
      body.verificationCode,
      body.newPassword,
      (req as unknown as SessionRequest).session,
    );

    if (!data) throw new BadRequestException("Invalid verification code");

    return responseHandler([data], "Password Successfully Reset");
  }
}
