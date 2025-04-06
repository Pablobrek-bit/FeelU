import type { CreateProfileSchema } from '../dto/profile/create-profile-schema';

export abstract class ProfileRepository {
  abstract createProfile(
    profile: CreateProfileSchema,
    userId: string,
  ): Promise<void>;
}
