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
});
