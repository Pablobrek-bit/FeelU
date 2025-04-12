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
    await this.prisma.$transaction(async (tx) => {
      const { id: filterId } = await tx.filter.upsert({
        where: { userId },
        create: { userId },
        update: {},
        select: { id: true },
      });

      // Ensure filters array is not empty before proceeding
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

      // Avoid createMany if filterPreferences is empty
      if (filterPreferences.length > 0) {
        await tx.filterPreference.createMany({
          data: filterPreferences,
          skipDuplicates: true, // Consider if duplicates should be skipped or cause an error
        });
      }
    });
  }

  async updateFilter(
    filter: UpdateFilterSchema[],
    userId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const { id: filterId } = await tx.filter.findFirstOrThrow({
        where: { userId },
        select: { id: true },
      });

      const filterPreferencesUpdated = filter.flatMap((filter) => {
        return (
          filter.sexualOrientations?.map((SexualOrientation) => ({
            gender: filter.gender,
            SexualOrientation,
            filterId,
          })) || []
        );
      });

      await tx.filterPreference.updateMany({
        where: { filterId },
        data: filterPreferencesUpdated,
      });
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
