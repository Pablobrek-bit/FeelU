import { Injectable } from '@nestjs/common';
import { CreateFilterSchema } from '../../../application/dto/filter/create-filter-schema';
import { FilterRepository } from '../../../application/ports/filter.repository';
import { PrismaService } from '../../config/prisma.service';
import type { UpdateFilterSchema } from '../../../application/dto/filter/update-filter-schema';

@Injectable()
export class PrismaFilterRepository implements FilterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFilter(
    filters: CreateFilterSchema[],
    userId: string,
  ): Promise<void> {
    const { id: filterId } = await this.prisma.filter.upsert({
      where: { userId },
      create: { userId },
      update: {},
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

  async updateFilter(
    filter: UpdateFilterSchema[],
    userId: string,
  ): Promise<void> {
    const { id: filterId } = await this.prisma.filter.findFirstOrThrow({
      where: { userId },
      select: { id: true },
    });

    const filterPreferencesUpdated = filter.flatMap((filter) => {
      filter.sexualOrientations?.map((SexualOrientation) => ({
        gender: filter.gender,
        SexualOrientation,
        filterId,
      }));
    });

    await this.prisma.filterPreference.updateMany({
      where: { filterId },
      data: filterPreferencesUpdated,
    });
  }

  async removeFilterPreferences(userId: string): Promise<void> {
    const { id: filterId } = await this.prisma.filter.findFirstOrThrow({
      where: { userId },
      select: { id: true },
    });

    await this.prisma.filterPreference.deleteMany({
      where: { filterId },
    });
  }
}
