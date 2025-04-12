import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ViewRepository } from '../../../application/ports/view.repository';

@Injectable()
export class PrismaViewRepository implements ViewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPotentialMatchesIds(
    userId: string,
    limit: number,
  ): Promise<string[]> {
    const views = await this.prisma.view.findMany({
      where: { userId },
      select: { viewedUser: true },
      take: limit,
    });
    return views.map((view) => view.viewedUser);
  }

  async registerView(userId: string, viewedUserId: string): Promise<void> {
    await this.prisma.view.create({
      data: {
        userId,
        viewedUser: viewedUserId,
      },
    });
  }

  async hasUserViewed(userId: string, viewedUserId: string): Promise<boolean> {
    const view = await this.prisma.view.findFirst({
      where: {
        userId,
        viewedUser: viewedUserId,
      },
      select: {
        id: true,
      },
    });
    return !!view;
  }
}
