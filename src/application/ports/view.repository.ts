export abstract class ViewRepository {
  abstract findPotentialMatchesIds(
    userId: string,
    limit: number,
  ): Promise<string[]>;
  abstract registerView(userId: string, viewedUserId: string): Promise<void>;
}
