export abstract class MatchRepository {
  abstract registerMatch(userId: string, matchedUserId: string): Promise<void>;
  abstract getMatches(userId: string): Promise<string[]>;
}
