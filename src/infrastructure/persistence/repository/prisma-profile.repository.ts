import { CreateProfileSchema } from '../../../application/dto/profile/create-profile-schema';
import { ProfileRepository } from '../../../application/ports/profile.repository';
import { PrismaService } from '../../config/prisma.service';

export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createProfile(
    profile: CreateProfileSchema,
    userId: string,
  ): Promise<void> {
    await this.prisma.profile.create({
      data: {
        age: profile.age,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        gender: profile.gender,
        name: profile.name,
        sexualOrientation: profile.sexualOrientation,
        course: profile.course,
        favoriteEmoji: profile.emoji,
        instagramUrl: profile.instagramUrl,
        institution: profile.institution,
        showGender: profile.genderIsVisible,
        showSexualOrientation: profile.sexualOrientationVisible,
        userId,
      },
    });
  }

  async teste() {
    await this.prisma.profile.findMany({});
  }
}
