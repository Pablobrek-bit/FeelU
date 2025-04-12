import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../ports/like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async countByUserId(userId: string): Promise<number> {
    return this.likeRepository.countLikesByUserId(userId);
  }
}
