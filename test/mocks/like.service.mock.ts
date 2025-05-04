import type { LikeService } from '../../src/application/service/like.service';

export const createMockLikeService = (): jest.Mocked<Partial<LikeService>> => ({
  countByUserId: jest.fn(),
  registerLike: jest.fn(),
});
