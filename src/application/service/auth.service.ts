import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginUserSchema } from '../dto/user/login-user-schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService, // Ensure JwtService is injected
  ) {}

  async login(loginData: LoginUserSchema): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findUserByEmail(loginData.email);

    if (!user || user.password !== loginData.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
