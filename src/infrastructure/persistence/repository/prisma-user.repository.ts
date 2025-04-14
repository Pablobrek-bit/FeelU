import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UserRepository } from '../../../application/ports/user.repository';
import { UserConverter } from '../converter/user-converter';
import type { UserModel } from '../../../domain/model/user-model';
import type { Gender, Role, SexualOrientation } from '@prisma/client';
import type { FilterModel } from '../../../domain/model/filters-model';
import { FilterConverter } from '../converter/filter-converter';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existUserByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email, deleted: false },
    });
    return count > 0;
  }

  async createUser(
    email: string,
    password: string,
    roleName: string,
    verificationToken: string,
  ): Promise<string> {
    const { id } = await this.prisma.user.create({
      data: {
        email: email,
        password: password,
        deletedAt: null,
        deleted: false,
        verificationToken: verificationToken,
        role: {
          connect: {
            name: roleName,
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
      where: { email, deleted: false, emailVerified: true },
      select: { id: true, email: true, password: true, role: true },
    });
  }

  async existUserById(userId: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id: userId, deleted: false },
    });
    return count > 0;
  }

  async updateUserPassword(userId: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId, deleted: false },
      data: { password },
    });
  }

  async getById(userId: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deleted: false },
      include: {
        filter: {
          include: {
            preferences: true,
          },
        },
        profile: {
          where: { deleted: false },
        },
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

  async findUserByIds(userIds: string[]): Promise<UserModel[] | []> {
    if (userIds.length === 0) {
      return [];
    }
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        emailVerified: true,
        deleted: false,
      },
      include: {
        profile: {
          where: { deleted: false },
        },
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
      where: { id: userId, deleted: false },
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
    const excludedUserIds = [...viewedUserIds, userId];

    const users = await this.prisma.user.findMany({
      where: {
        emailVerified: true,
        deleted: false,
        id: {
          notIn: excludedUserIds,
        },
        profile: {
          gender: { in: genders },
          sexualOrientation: { in: sexualOrientations },
          deleted: false,
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
      where: { verificationToken: token, deleted: false },
      select: {
        id: true,
      },
    });

    return user?.id ?? null;
  }

  async updateUserVerificationToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId, deleted: false },
      data: {
        verificationToken: null,
        emailVerified: true,
      },
    });
  }

  async softDeleteUser(userId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
      await tx.profile.updateMany({
        where: { userId },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
    });
  }

  async existUserByIdAndGetYourFilters(
    userId: string,
  ): Promise<FilterModel[] | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deleted: false },
      include: {
        filter: {
          include: {
            preferences: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    if (!user.filter) {
      return null;
    }
    return user.filter.preferences.map((preference) => {
      return FilterConverter.entityToModel(preference);
    });
  }
}
