import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../ports/profile.repository';
import { CreateProfileSchema } from '../dto/profile/create-profile-schema';
import type { UpdateProfileSchema } from '../dto/profile/update-profile-schema';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createProfile(
    profile: CreateProfileSchema,
    userId: string,
  ): Promise<void> {
    await this.profileRepository.createProfile(profile, userId);
  }

  async updateProfile(
    profile: UpdateProfileSchema | undefined,
    userId: string,
  ): Promise<void> {
    await this.profileRepository.updateProfile(profile, userId);
  }
}
