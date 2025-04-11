/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../../application/service/user.service';
import { LoginUserSchema } from '../../application/dto/user/login-user-schema';
import { AuthService } from '../../application/service/auth.service';
import { UpdateUserSchema } from '../../application/dto/user/update-user-schema';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../shared/utils/multer.utils';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TestSchema } from '../../application/dto/user/test-schema';
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async createUserWithProfileAndFilter(
    @Body() body: any,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    const userCreateData = CreateUserSchema.fromRaw(body);

    const errors = await validate(userCreateData);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.userService.createUser(userCreateData, avatar);
  }

  @Post('test')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async test(
    @Req() req: Request,
    @Body() test: any,
  ): Promise<{ message: string }> {
    console.log('test', test);
    console.log('file', req.file);
    const dto = plainToInstance(TestSchema, test);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    console.log('User ID (do token):', req.user.sub);
    console.log('Test data:', dto);
    return { message: 'ok' };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginUserSchema): Promise<{ token: string }> {
    return this.authService.login(loginData);
  }

  @Put('update')
  @HttpCode(200)
  async updateUser(
    @Req() req: Request,
    @Body()
    userUpdateData: UpdateUserSchema,
  ): Promise<void> {
    const userId = req.user.sub;

    await this.userService.updateUserDetails(userUpdateData, userId);
  }

  @Get()
  @HttpCode(200)
  async getUser(@Req() req: Request): Promise<UserModel> {
    const userId = req.user.sub;
    return await this.userService.getUserById(userId);
  }

  @Get('verify-email')
  @HttpCode(200)
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.userService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Delete('delete')
  @HttpCode(204)
  async deleteUser(@Req() req: Request): Promise<void> {
    const userId = req.user.sub;
    await this.userService.softDelete(userId);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    // Placeholder implementation
    console.log('File received:', file);
    console.log('Avatar uploaded for user:', req.user.sub);
    return { message: 'Avatar uploaded successfully' };
  }
}
