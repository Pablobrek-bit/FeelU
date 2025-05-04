import type { LikeRepository } from '../../src/application/ports/like.repository';

export const createMockLikeRepository = (): Partial<LikeRepository> => ({
  checkIfMatch: jest.fn(),
  countLikesByUserId: jest.fn(),
  getLikedProfiles: jest.fn(),
  registerLike: jest.fn(),
});
