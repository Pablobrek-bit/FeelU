import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '../../shared/exception/EntityNotFoundException';
import type { UserModel } from '../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';
import { UserService } from './user.service';
import type { FilterModel } from '../../domain/model/filters-model';
import { ViewService } from './view.service';
import { MatchService } from './match.service';
import { LikeService } from './like.service';

@Injectable()
export class SwipeService {
  constructor(
    private readonly userService: UserService,
    private readonly viewService: ViewService,
    private readonly matchService: MatchService,
    private readonly likeService: LikeService,
  ) {}

  async findPotentialMatches(userId: string): Promise<UserModel[]> {
    const user = await this.getUserOrThrow(userId);

    const { genders, sexualOrientations } = this.extractFilterPreferences(
      user.filters,
    );

    const usersIdFind = await this.viewService.findPotentialMatchesIds(
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
    await this.viewService.registerView(userId, swipedUserId);

    if (liked) {
      const isMatch = await this.likeService.registerLike(userId, swipedUserId);
      if (isMatch) {
        await this.matchService.registerMatch(userId, swipedUserId);
      }
    }
  }

  async getMatches(userId: string): Promise<UserModel[]> {
    this.definedTheDataOfTheFuncionality(new Date('2025-06-12T11:00:00Z'));

    await this.getUserOrThrow(userId);
    const matchesIds = await this.matchService.getMatchesByUserId(userId);
    return await this.userService.findUsersByIds(matchesIds);
  }

  async getLikedProfiles(userId: string): Promise<UserModel[]> {
    this.definedTheDataOfTheFuncionality(new Date('2025-06-12T11:00:00Z'));

    await this.getUserOrThrow(userId);

    const likedProfilesIds = await this.likeService.getLikedProfiles(userId);

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

  private definedTheDataOfTheFuncionality(featureAvailableDate: Date): void {
    const currentDate = new Date();

    if (currentDate < featureAvailableDate) {
      throw new ForbiddenException(
        'This feature is not available yet. Please check back later.',
      );
    }
  }
}
