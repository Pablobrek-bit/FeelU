import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../ports/match.repository';

@Injectable()
export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async registerMatch(userId: string, matchedUserId: string): Promise<void> {
    await this.matchRepository.registerMatch(userId, matchedUserId);
  }

  async getMatchesByUserId(userId: string): Promise<string[]> {
    return await this.matchRepository.getMatches(userId);
  }
}
