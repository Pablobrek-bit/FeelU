import type { UserModel } from '../../domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';

export abstract class SwipeRepository {
  abstract findPotentialMatches(
    userId: string,
    filters: {
      genders: Gender[];
      sexualOrientations: SexualOrientation[];
    },
    limit: number,
  ): Promise<UserModel[]>;

  abstract registerView(userId: string, viewedUserId: string): Promise<void>;

  abstract registerLike(userId: string, likedUserId: string): Promise<boolean>;

  abstract checkIfMatch(userId: string, likedUserId: string): Promise<boolean>;

  abstract registerMatch(userId: string, matchedUserId: string): Promise<void>;

  abstract getMatches(userId: string): Promise<string[]>;
}
