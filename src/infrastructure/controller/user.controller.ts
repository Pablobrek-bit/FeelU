import {
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
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';
import { LoginUserSchema } from '../../application/dto/user/login-user-schema';
import { AuthService } from '../../application/service/auth.service';
import { UpdateUserSchema } from '../../application/dto/user/update-user-schema';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../shared/utils/multer.utils';

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
    @Body() userCreateData: CreateUserSchema,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.userService.createUser(userCreateData, avatar);
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

  @Post('test')
  @HttpCode(200)
  async test(@Req() req: Request): Promise<{ message: string }> {
    console.log('User ID (do token):', req.user.sub);
    return { message: 'ok' };
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
