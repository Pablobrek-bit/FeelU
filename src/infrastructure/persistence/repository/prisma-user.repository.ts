import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UserRepository } from '../../../application/ports/user.repository';
import { UserConverter } from '../converter/user-converter';
import type { UserModel } from '../../../domain/model/user-model';
import type { Gender, Role, SexualOrientation } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async existUserByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async createUser(user: {
    email: string;
    password: string;
    roleName: string;
    verificationToken: string;
  }): Promise<string> {
    const { id } = await this.prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        deleted: false,
        verificationToken: user.verificationToken,
        role: {
          connect: {
            name: user.roleName,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return id;
  }

  async findUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    password: string;
    role: Role;
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

  async getById(userId: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        filter: {
          include: {
            preferences: true,
          },
        },
        profile: true,
      },
    });

    return user && user.profile
      ? UserConverter.entityToModel(
          user,
          user.profile,
          user.filter?.preferences,
        )
      : null;
  }

  async findUserByIds(userIds: string[]): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        profile: true,
      },
    });

    return users.map((user) => {
      if (!user.profile) {
        throw new Error('User profile is null');
      }
      return UserConverter.entityToModel(user, user.profile);
    });
  }

  async updateUserRole(userId: string, roleName: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: {
          connect: {
            name: roleName,
          },
        },
      },
    });
  }

  async findPotentialMatches(
    userId: string,
    viewedUserIds: string[],
    genders: Gender[],
    sexualOrientations: SexualOrientation[],
    limit: number,
  ): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      where: {
        emailVerified: true,
        id: {
          notIn: viewedUserIds,
          not: userId,
        },
        profile: {
          gender: {
            in: genders,
          },
          sexualOrientation: {
            in: sexualOrientations,
          },
        },
      },
      include: {
        profile: true,
      },
      take: limit,
    });

    return users.map((user) => {
      if (user.profile) {
        return UserConverter.entityToModel(user, user.profile);
      }
      throw new Error('User profile is null');
    });
  }

  async findUserByVerificationToken(token: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
      },
    });

    return user ? user.id : null;
  }

  async updateUserVerificationToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: null,
        emailVerified: true,
      },
    });
  }
}
