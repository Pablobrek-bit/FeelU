import type { FilterPreference, Profile, User } from '@prisma/client';
import { UserModel } from '../../../domain/model/user-model';
import { FilterConverter } from './filter-converter';

export class UserConverter {
  static entityToModel(
    user: User,
    profile: Profile,
    preferences?: FilterPreference[],
  ): UserModel {
    return new UserModel(
      user.id,
      profile.name,
      profile.avatarUrl,
      profile.age,
      profile.gender,
      profile.sexualOrientation,
      profile.showGender,
      profile.showSexualOrientation,
      profile.bio,
      profile.favoriteEmoji ?? undefined,
      profile.course ?? undefined,
      profile.institution ?? undefined,
      profile.instagramUrl ?? undefined,
      preferences
        ? preferences.map((preference) => {
            return FilterConverter.entityToModel(preference);
          })
        : undefined,
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
