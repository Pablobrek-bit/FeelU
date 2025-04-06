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
    console.log('Creating user in PrismaUserRepository', user);

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

  async teste(): Promise<void> {
    await this.prisma.user.findMany({});
    console.log('terminou de buscar user');
    await this.prisma.profile.findMany({});
    console.log('terminou de buscar profile');
    await this.prisma.filter.findMany({});
    console.log('terminou de buscar filter');
  }
}
