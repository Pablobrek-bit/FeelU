import { Injectable } from '@nestjs/common';
import { CreateProfileSchema } from '../../../application/dto/profile/create-profile-schema';
import { ProfileRepository } from '../../../application/ports/profile.repository';
import { PrismaService } from '../../config/prisma.service';
import type { UpdateProfileSchema } from '../../../application/dto/profile/update-profile-schema';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createProfile(
    profile: CreateProfileSchema,
    userId: string,
    avatarUrl: string,
  ): Promise<void> {
    await this.prisma.profile.create({
      data: {
        age: profile.age,
        avatarUrl: avatarUrl,
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
        deleted: false,
      },
    });
  }

  async updateProfile(
    profile: UpdateProfileSchema | undefined,
    userId: string,
    avatarUrl?: string,
  ) {
    const updateData = {
      ...(profile?.bio && { bio: profile.bio }),
      ...(profile?.emoji && { favoriteEmoji: profile.emoji }),
      ...(profile?.genderIsVisible !== undefined && {
        showGender: profile.genderIsVisible,
      }),
      ...(profile?.sexualOrientationVisible !== undefined && {
        showSexualOrientation: profile.sexualOrientationVisible,
      }),
      ...(profile?.course && { course: profile.course }),
      ...(profile?.institution && { institution: profile.institution }),
      ...(profile?.instagramUrl && { instagramUrl: profile.instagramUrl }),
      ...(avatarUrl && { avatarUrl }),
    };

    if (Object.keys(updateData).length > 0) {
      await this.prisma.profile.updateMany({
        where: { userId, deleted: false },
        data: updateData,
      });
    }
  }

  async getAvatarUrl(userId: string): Promise<string | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId, deleted: false },
      select: { avatarUrl: true },
    });

    return profile?.avatarUrl || null;
  }
}
