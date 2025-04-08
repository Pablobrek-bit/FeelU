import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { SwipeRepository } from '../../../application/ports/swipe.repository';
import { UserConverter } from '../converter/user-converter';
import type { UserModel } from '../../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';

@Injectable()
export class PrismaSwipeRepository implements SwipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPotentialMatches(
    userId: string,
    filters: {
      genders: Gender[];
      sexualOrientations: SexualOrientation[];
    },
    limit: number,
  ): Promise<UserModel[]> {
    const viewedUserIds = await this.prisma.view.findMany({
      where: { userId },
      select: { viewedUser: true },
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: {
            in: viewedUserIds.map((view) => view.viewedUser),
          },
          notIn: [userId],
        },
        profile: {
          gender: {
            in: filters.genders,
          },
          sexualOrientation: {
            in: filters.sexualOrientations,
          },
        },
      },
      include: {
        profile: true,
      },
      take: limit,
    });

    return users
      .filter((user) => user.profile !== null)
      .map((user) => {
        if (user.profile) {
          return UserConverter.entityToModel(user, user.profile);
        }
        throw new Error('User profile is null');
      });
  }

  async registerView(userId: string, viewedUserId: string): Promise<void> {
    await this.prisma.view.create({
      data: {
        userId,
        viewedUser: viewedUserId,
      },
    });
  }

  async registerLike(userId: string, likedUserId: string): Promise<boolean> {
    await this.prisma.like.create({
      data: {
        userId,
        likedUser: likedUserId,
      },
    });

    // Verificar se é um match
    return this.checkIfMatch(userId, likedUserId);
  }

  async checkIfMatch(userId: string, likedUserId: string): Promise<boolean> {
    // Verificar se o usuário curtido também curtiu o usuário atual
    const otherUserLike = await this.prisma.like.findFirst({
      where: {
        userId: likedUserId,
        likedUser: userId,
      },
    });

    return !!otherUserLike;
  }

  async registerMatch(userId: string, matchedUserId: string): Promise<void> {
    await this.prisma.match.createMany({
      data: [
        {
          userId,
          matchedUser: matchedUserId,
        },
        {
          userId: matchedUserId,
          matchedUser: userId,
        },
      ],
    });
  }

  async getMatches(userId: string): Promise<string[]> {
    const users = await this.prisma.match.findMany({
      where: {
        userId,
      },
      select: {
        matchedUser: true,
      },
    });

    return users.map((user) => user.matchedUser);
  }
}
