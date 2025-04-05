import { Injectable } from '@nestjs/common';
import { CreateFilterSchema } from '../../../application/dto/filter/create-filter-schema';
import { FilterRepository } from '../../../application/ports/filter.repository';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaFilterRepository implements FilterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFilter(
    filters: CreateFilterSchema[],
    userId: string,
  ): Promise<void> {
    const { id: filterId } = await this.prisma.filter.create({
      data: { userId },
      select: { id: true },
    });

    const filterPreferences = filters.flatMap((filter) =>
      filter.sexualOrientations.map((sexualOrientation) => ({
        gender: filter.gender,
        sexualOrientation,
        filterId,
      })),
    );

    await this.prisma.filterPreference.createMany({
      data: filterPreferences,
    });
  }

  async teste() {
    await this.prisma.filter.findMany({});
  }
}
