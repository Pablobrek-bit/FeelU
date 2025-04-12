import { Injectable } from '@nestjs/common';
import { ViewRepository } from '../ports/view.repository';

@Injectable()
export class ViewService {
  constructor(private readonly viewRepository: ViewRepository) {}

  async findPotentialMatchesIds(
    userId: string,
    limit: number,
  ): Promise<string[]> {
    return this.viewRepository.findPotentialMatchesIds(userId, limit);
  }

  async registerView(userId: string, viewedUserId: string): Promise<void> {
    const hasViewed = await this.viewRepository.hasUserViewed(
      userId,
      viewedUserId,
    );
    if (hasViewed) {
      return;
    }

    return this.viewRepository.registerView(userId, viewedUserId);
  }
}
