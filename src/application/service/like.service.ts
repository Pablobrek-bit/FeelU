import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../ports/like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async countByUserId(userId: string): Promise<number> {
    return this.likeRepository.countLikesByUserId(userId);
  }

  async registerLike(userId: string, likedUserId: string): Promise<boolean> {
    return this.likeRepository.registerLike(userId, likedUserId);
  }

  async areUsersMatched(userId: string, likedUserId: string): Promise<boolean> {
    return this.likeRepository.checkIfMatch(userId, likedUserId);
  }

  async getLikedProfiles(userId: string): Promise<string[]> {
    return this.likeRepository.getLikedProfiles(userId);
  }
}
