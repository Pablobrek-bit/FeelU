import type { CreateProfileSchema } from '../dto/profile/create-profile-schema';
import type { UpdateProfileSchema } from '../dto/profile/update-profile-schema';

export abstract class ProfileRepository {
  abstract createProfile(
    profile: CreateProfileSchema,
    userId: string,
  ): Promise<void>;

  abstract updateProfile(
    profile: UpdateProfileSchema | undefined,
    userId: string,
  );
}
