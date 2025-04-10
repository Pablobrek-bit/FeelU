import type { FilterPreference } from '@prisma/client';
import { FilterModel } from '../../../domain/model/filters-model';

export class FilterConverter {
  static entityToModel(filterPreference: FilterPreference): FilterModel {
    return new FilterModel(
      filterPreference?.gender,
      filterPreference.sexualOrientation,
    );
  }
}
