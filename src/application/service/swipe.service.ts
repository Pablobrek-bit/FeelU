import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import type { UserModel } from '../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';
import { UserService } from './user.service';
import type { FilterModel } from '../../domain/model/filters-model';
import { ViewService } from './view.service';
import { MatchService } from './match.service';
import { LikeService } from './like.service';

@Injectable()
export class SwipeService {
  private readonly logger = new Logger(SwipeService.name);

  private MATCHES_AVAILABLE_DATE = new Date('2025-06-12T11:00:00Z');
  private LIKED_PROFILES_AVAILABLE_DATE = new Date('2025-06-12T11:00:00Z');
  private readonly POTENTIAL_MATCH_LIMIT = 10;

  constructor(
    private readonly userService: UserService,
    private readonly viewService: ViewService,
    private readonly matchService: MatchService,
    private readonly likeService: LikeService,
  ) {}

  async findPotentialMatches(userId: string): Promise<UserModel[]> {
    const filters = await this.getUserOrThrow(userId);

    const { genders, sexualOrientations } =
      this.extractFilterPreferences(filters);

    const viewedUserIds = await this.viewService.findPotentialMatchesIds(
      userId,
      this.POTENTIAL_MATCH_LIMIT,
    );

    if (viewedUserIds.length === 0) {
      this.logger.log(`No viewed users found for user ${userId}`);
      return [];
    }

    return await this.userService.findPotentialMatches(
      userId,
      viewedUserIds,
      genders,
      sexualOrientations,
      this.POTENTIAL_MATCH_LIMIT,
    );
  }

  async swipeProfile(
    userId: string,
    swipedUserId: string,
    liked: boolean,
  ): Promise<void> {
    if (userId === swipedUserId) {
      throw new ForbiddenException('You cannot swipe your own profile.');
    }

    await this.viewService.registerView(userId, swipedUserId);

    if (liked) {
      this.logger.log(`User ${userId} liked profile ${swipedUserId}`);
      const isMatch = await this.likeService.registerLike(userId, swipedUserId);
      if (isMatch) {
        await this.matchService.registerMatch(userId, swipedUserId);
        this.logger.log(`Match created between ${userId} and ${swipedUserId}`);
      }
    }
  }

  async getMatches(userId: string): Promise<UserModel[] | []> {
    this.checkFeatureAvailability(this.MATCHES_AVAILABLE_DATE);

    await this.getUserOrThrow(userId);
    const matchesIds = await this.matchService.getMatchesByUserId(userId);
    if (matchesIds.length === 0) {
      return [];
    }
    return await this.userService.findUsersByIds(matchesIds);
  }

  async getLikedProfiles(userId: string): Promise<UserModel[] | []> {
    this.checkFeatureAvailability(this.LIKED_PROFILES_AVAILABLE_DATE);

    await this.getUserOrThrow(userId);

    const likedProfilesIds = await this.likeService.getLikedProfiles(userId);
    if (likedProfilesIds.length === 0) {
      return [];
    }

    return await this.userService.findUsersByIds(likedProfilesIds);
  }

  private async getUserOrThrow(userId: string): Promise<FilterModel[]> {
    return await this.userService.verifyUserExistsAndGetYourFilters(userId);
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

  private checkFeatureAvailability(featureAvailableDate: Date): void {
    const currentDate = new Date();

    if (currentDate < featureAvailableDate) {
      throw new ForbiddenException(
        'This feature is not available yet. Please check back later.',
      );
    }
  }
}
