export abstract class SwipeRepository {
  abstract findPotentialMatchesIds(
    userId: string,
    limit: number,
  ): Promise<string[]>;

  abstract registerView(userId: string, viewedUserId: string): Promise<void>;

  abstract registerLike(userId: string, likedUserId: string): Promise<boolean>;

  abstract checkIfMatch(userId: string, likedUserId: string): Promise<boolean>;

  abstract registerMatch(userId: string, matchedUserId: string): Promise<void>;

  abstract getMatches(userId: string): Promise<string[]>;

  abstract getLikedProfiles(userId: string): Promise<string[]>;
}
