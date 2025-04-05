import { CreateFilterSchema } from '../../../application/dto/filter/create-filter-schema';
import { FilterRepository } from '../../../application/ports/filter.repository';
import { PrismaService } from '../../config/prisma.service';

export class PrismaFilterRepository implements FilterRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createFilter(
    filter: CreateFilterSchema,
    userId: string,
  ): Promise<void> {
    const { gender } = filter;

    await this.prisma.filter.create({
      data: {
        preferences: {
          createMany: {
            data: filter.sexualOrientations.map((sexualOrientation) => {
              return {
                gender,
                sexualOrientation,
              };
            }),
          },
        },
        userId,
      },
    });
  }

  async teste() {
    await this.prisma.filter.findMany({});
  }
}
