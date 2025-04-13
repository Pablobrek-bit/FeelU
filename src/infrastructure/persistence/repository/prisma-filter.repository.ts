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
    await this.prisma.$transaction(async (tx) => {
      const { id: filterId } = await tx.filter.upsert({
        where: { userId },
        create: { userId },
        update: {},
        select: { id: true },
      });

      if (filters.length === 0) {
        return;
      }

      const filterPreferences = filters.flatMap((filter) =>
        filter.sexualOrientations.map((sexualOrientation) => ({
          gender: filter.gender,
          sexualOrientation,
          filterId,
        })),
      );

      if (filterPreferences.length > 0) {
        await tx.filterPreference.createMany({
          data: filterPreferences,
          skipDuplicates: true,
        });
      }
    });
  }

  async updateFilter(
    filters: CreateFilterSchema[],
    userId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const filterRecord = await tx.filter.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!filterRecord) {
        return;
      }

      const filterId = filterRecord.id;

      await tx.filterPreference.deleteMany({
        where: { filterId },
      });

      const newFilterPreferencesData = filters.flatMap((filter) => {
        return (
          filter.sexualOrientations?.map((sexualOrientation) => ({
            gender: filter.gender,
            sexualOrientation,
            filterId,
          })) || []
        );
      });

      if (newFilterPreferencesData.length > 0) {
        await tx.filterPreference.createMany({
          data: newFilterPreferencesData,
          skipDuplicates: true,
        });
      }
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
