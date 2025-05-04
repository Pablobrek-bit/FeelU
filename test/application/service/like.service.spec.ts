import { Test } from '@nestjs/testing';
import { LikeService } from '../../../src/application/service/like.service';
import { createMockLikeRepository } from '../../mocks/like.repository.mock';
import { LikeRepository } from '../../../src/application/ports/like.repository';

describe('LikeService', () => {
  let service: LikeService;
  let mockLikeRepository: ReturnType<typeof createMockLikeRepository>;

  beforeEach(async () => {
    mockLikeRepository = createMockLikeRepository();
    const moduleRef = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: LikeRepository,
          useValue: mockLikeRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<LikeService>(LikeService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('countByUserId', () => {
    it('should call countLikesByUserId with the correct userId', async () => {
      // Arrange
      const userId = 'user123';
      const expectedCount = 5;
      (mockLikeRepository.countLikesByUserId as jest.Mock).mockResolvedValue(
        expectedCount,
      );

      // Act
      const result = await service.countByUserId(userId);

      // Assert
      expect(mockLikeRepository.countLikesByUserId).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toEqual(expectedCount);
    });

    it('should return 0 if no likes are found', async () => {
      // Arrange
      const userId = 'user123';
      (mockLikeRepository.countLikesByUserId as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await service.countByUserId(userId);

      // Assert
      expect(mockLikeRepository.countLikesByUserId).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toEqual(0);
    });
  });

  describe('registerLike', () => {
    it('should call registerLike with the correct userId and likedUserId', async () => {
      // Arrange
      const userId = 'user123';
      const likedUserId = 'likedUser456';
      const expectedResult = true;
      (mockLikeRepository.registerLike as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      // Act
      const result = await service.registerLike(userId, likedUserId);

      // Assert
      expect(mockLikeRepository.registerLike).toHaveBeenCalledWith(
        userId,
        likedUserId,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return false if the like registration fails', async () => {
      // Arrange
      const userId = 'user123';
      const likedUserId = 'likedUser456';
      const expectedResult = false;
      (mockLikeRepository.registerLike as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.registerLike(userId, likedUserId);

      // Assert
      expect(mockLikeRepository.registerLike).toHaveBeenCalledWith(
        userId,
        likedUserId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('areUsersMatched', () => {
    it('should call checkIfMatch with the correct userId and likedUserId', async () => {
      // Arrange
      const userId = 'user123';
      const likedUserId = 'likedUser456';
      const expectedResult = true;
      (mockLikeRepository.checkIfMatch as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      // Act
      const result = await service.areUsersMatched(userId, likedUserId);

      // Assert
      expect(mockLikeRepository.checkIfMatch).toHaveBeenCalledWith(
        userId,
        likedUserId,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return false if the match check fails', async () => {
      // Arrange
      const userId = 'user123';
      const likedUserId = 'likedUser456';
      const expectedResult = false;
      (mockLikeRepository.checkIfMatch as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.areUsersMatched(userId, likedUserId);

      // Assert
      expect(mockLikeRepository.checkIfMatch).toHaveBeenCalledWith(
        userId,
        likedUserId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getLikedProfiles', () => {
    it('should call getLikedProfiles with the correct userId', async () => {
      // Arrange
      const userId = 'user123';
      const expectedLikedProfiles = ['likedUser456', 'likedUser789'];
      (mockLikeRepository.getLikedProfiles as jest.Mock).mockResolvedValue(
        expectedLikedProfiles,
      );

      // Act
      const result = await service.getLikedProfiles(userId);

      // Assert
      expect(mockLikeRepository.getLikedProfiles).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedLikedProfiles);
    });

    it('should return an empty array if no liked profiles are found', async () => {
      // Arrange
      const userId = 'user123';
      (mockLikeRepository.getLikedProfiles as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await service.getLikedProfiles(userId);

      // Assert
      expect(mockLikeRepository.getLikedProfiles).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });
  });
});
