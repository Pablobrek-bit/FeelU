import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../ports/profile.repository';
import { CreateProfileSchema } from '../dto/profile/create-profile-schema';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createProfile(
    profile: CreateProfileSchema,
    userId: string,
  ): Promise<void> {
    await this.profileRepository.createProfile(profile, userId);
  }

  async teste() {
    await this.profileRepository.teste();
  }
}
