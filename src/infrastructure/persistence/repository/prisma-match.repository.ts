import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MatchRepository } from '../../../application/ports/match.repository';

@Injectable()
export class PrismaMatchRepository implements MatchRepository {
  constructor(private readonly prisma: PrismaService) {}

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
