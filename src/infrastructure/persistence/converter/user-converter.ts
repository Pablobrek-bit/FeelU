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
