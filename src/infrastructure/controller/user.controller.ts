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
} from '@nestjs/common';
import { UserService } from '../../application/service/user.service';
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';
import { LoginUserSchema } from '../../application/dto/user/login-user-schema';
import { AuthService } from '../../application/service/auth.service';
import { UpdateUserSchema } from '../../application/dto/user/update-user-schema';
import type { Request } from 'express';
import type { UserModel } from '../../domain/model/user-model';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @HttpCode(201)
  async createUserWithProfileAndFilter(
    @Body() userCreateData: CreateUserSchema,
  ): Promise<void> {
    await this.userService.createUser(userCreateData);
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
}
