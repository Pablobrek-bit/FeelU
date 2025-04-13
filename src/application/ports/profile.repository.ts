import type { CreateProfileSchema } from '../dto/profile/create-profile-schema';
import type { UpdateProfileSchema } from '../dto/profile/update-profile-schema';

export abstract class ProfileRepository {
  abstract createProfile(
    profile: CreateProfileSchema,
    userId: string,
    avatarUrl: string,
  ): Promise<void>;

  abstract updateProfile(
    profile: UpdateProfileSchema | undefined,
    userId: string,
    avatarUrl?: string,
  ): Promise<void>;

  abstract getAvatarUrl(userId: string): Promise<string | null>;
}
