import { Injectable } from '@nestjs/common';
import { FilterRepository } from '../ports/filter.repository';
import { CreateFilterSchema } from '../dto/filter/create-filter-schema';

@Injectable()
export class FilterService {
  constructor(private readonly filterRepository: FilterRepository) {}

  async createFilter(
    filters: CreateFilterSchema[],
    userId: string,
  ): Promise<void> {
    await this.filterRepository.createFilter(filters, userId);
  }

  async updateFilter(
    filters: CreateFilterSchema[] | undefined,
    userId: string,
  ): Promise<void> {
    if (!filters) {
      return;
    }

    await this.filterRepository.updateFilter(filters, userId);
  }
}
