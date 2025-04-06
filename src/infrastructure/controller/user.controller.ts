import { Body, Controller, HttpCode, Post, Put, Req } from '@nestjs/common';
import { UserService } from '../../application/service/user.service';
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';
import { LoginUserSchema } from '../../application/dto/user/login-user-schema';
import { AuthService } from '../../application/service/auth.service';
import { UpdateUserSchema } from '../../application/dto/user/update-user-schema';
import type { Request } from 'express';

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
    await this.userService.createUserWithProfileAndFilter(userCreateData);
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

    await this.userService.updateUser(userUpdateData, userId);
  }

  // metodo de test para ver se o middleware de autenticação esta funcionando
  @Post('test')
  @HttpCode(200)
  async test(@Req() req: Request): Promise<{ message: string }> {
    console.log('User ID (do token):', req.user.sub);
    return { message: 'ok' };
  }

  // criar metodo de logout
  // criar metodo de refresh token
  // criar metodo de delete user
}
