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
    const user = await this.validateUser(loginData);
    const token = this.generateToken(user.id, user.role.name);
    return { token };
  }

  private async validateUser(loginData: LoginUserSchema) {
    const user = await this.userRepository.findUserByEmail(loginData.email);

    if (
      !user ||
      !(await this.isPasswordValid(loginData.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private generateToken(userId: string, roleName: string): string {
    const payload = { sub: userId, role: roleName };
    return this.jwtService.sign(payload);
  }
}
