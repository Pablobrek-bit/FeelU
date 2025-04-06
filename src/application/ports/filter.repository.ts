import type { CreateFilterSchema } from '../dto/filter/create-filter-schema';
import type { UpdateFilterSchema } from '../dto/filter/update-filter-schema';

export abstract class FilterRepository {
  abstract createFilter(
    filter: CreateFilterSchema[],
    userId: string,
  ): Promise<void>;

  abstract updateFilter(
    filter: UpdateFilterSchema[],
    userId: string,
  ): Promise<void>;

  abstract removeFilterPreferences(userId: string): Promise<void>;
}
