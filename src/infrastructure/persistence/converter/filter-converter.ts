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

// filter {
//   id: '113ba801-ded4-41bf-9be2-8b0d4bb1a6aa',
//   userId: '17507d3e-3c8b-423b-8fee-84fba06b32d5',
//   preferences: [
//     { gender: 'HOMEM', sexualOrientation: 'BI' },
//     { gender: 'MULHER', sexualOrientation: 'HETERO' }
//   ]
// }
// preferences [
//   { gender: 'HOMEM', sexualOrientation: 'BI' },
//   { gender: 'MULHER', sexualOrientation: 'HETERO' }
// ]
