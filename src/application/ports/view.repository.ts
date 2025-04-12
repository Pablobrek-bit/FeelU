export abstract class ViewRepository {
  abstract findPotentialMatchesIds(
    userId: string,
    limit: number,
  ): Promise<string[]>;

  abstract registerView(userId: string, viewedUserId: string): Promise<void>;

  abstract hasUserViewed(
    userId: string,
    viewedUserId: string,
  ): Promise<boolean>;
}
