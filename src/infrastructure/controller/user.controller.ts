import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from '../../application/service/user.service';
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';
import { LoginUserSchema } from '../../application/dto/user/login-user-schema';
import { AuthService } from '../../application/service/auth.service';

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

  // criar metodo de logout
  // criar metodo de refresh token
  // criar metodo de delete user
  // criar metodo de update user

  @Post('test')
  @HttpCode(200)
  async test() {
    await this.userService.test();
  }
}
