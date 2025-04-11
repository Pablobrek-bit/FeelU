import { Injectable } from '@nestjs/common';
import { SwipeRepository } from '../ports/swipe.repository';
import { EntityNotFoundException } from '../../shared/exception/EntityNotFoundException';
import type { UserModel } from '../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';
import { UserService } from './user.service';
import type { FilterModel } from '../../domain/model/filters-model';

@Injectable()
export class SwipeService {
  constructor(
    private readonly swipeRepository: SwipeRepository,
    private readonly userService: UserService,
  ) {}

  async findPotentialMatches(userId: string): Promise<UserModel[]> {
    const user = await this.getUserOrThrow(userId);

    const { genders, sexualOrientations } = this.extractFilterPreferences(
      user.filters,
    );

    const usersIdFind = await this.swipeRepository.findPotentialMatchesIds(
      userId,
      10,
    );

    return await this.userService.findPotentialMatches(
      userId,
      usersIdFind,
      genders,
      sexualOrientations,
      10,
    );
  }

  async swipeProfile(
    userId: string,
    swipedUserId: string,
    liked: boolean,
  ): Promise<void> {
    await this.swipeRepository.registerView(userId, swipedUserId);

    if (liked) {
      const isMatch = await this.swipeRepository.registerLike(
        userId,
        swipedUserId,
      );
      if (isMatch) {
        await this.swipeRepository.registerMatch(userId, swipedUserId);
      }
    }
  }

  async getMatches(userId: string): Promise<UserModel[]> {
    await this.getUserOrThrow(userId);
    const matchesIds = await this.swipeRepository.getMatches(userId);
    return await this.userService.findUsersByIds(matchesIds);
  }

  async getLikedProfiles(userId: string): Promise<UserModel[]> {
    await this.getUserOrThrow(userId);
    const likedProfilesIds =
      await this.swipeRepository.getLikedProfiles(userId);
    return await this.userService.findUsersByIds(likedProfilesIds);
  }

  private async getUserOrThrow(userId: string): Promise<UserModel> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new EntityNotFoundException('User');
    }
    return user;
  }

  private extractFilterPreferences(filters: FilterModel[] = []): {
    genders: Gender[];
    sexualOrientations: SexualOrientation[];
  } {
    const genders: Gender[] = [...new Set(filters.map((fp) => fp.gender))];
    const sexualOrientations: SexualOrientation[] = [
      ...new Set(filters.map((fp) => fp.sexualOrientation)),
    ];
    return { genders, sexualOrientations };
  }
}
