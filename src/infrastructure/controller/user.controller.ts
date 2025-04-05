import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from '../../application/service/user.service';
import { CreateUserSchema } from '../../application/dto/user/create-user-schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(201)
  async createUserWithProfileAndFilter(
    @Body() userCreateData: CreateUserSchema,
  ) {
    await this.userService.createUserWithProfileAndFilter(userCreateData);
  }

  @Post('test')
  @HttpCode(200)
  async test() {
    await this.userService.test();
  }
}
