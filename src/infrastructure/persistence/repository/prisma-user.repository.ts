import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UserRepository } from '../../../application/ports/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async existUserByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async createUser(user: { email: string; password: string }): Promise<string> {
    const userCreated = await this.prisma.user.create({
      data: user,
      select: {
        id: true,
      },
    });

    return userCreated.id;
  }

  async findUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    password: string;
    role: string;
  } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true },
    });
  }

  async existUserById(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return !!user;
  }

  async updateUserPassword(userId: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }
}
