import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginUserSchema } from '../dto/user/login-user-schema';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginUserSchema): Promise<{ token: string }> {
    const user = await this.userRepository.findUserByEmail(loginData.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
