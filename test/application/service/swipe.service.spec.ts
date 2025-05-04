import { Test } from '@nestjs/testing';
import { LikeService } from '../../../src/application/service/like.service';
import { MatchService } from '../../../src/application/service/match.service';
import { SwipeService } from '../../../src/application/service/swipe.service';
import { UserService } from '../../../src/application/service/user.service';
import { ViewService } from '../../../src/application/service/view.service';
import { createMockLikeService } from '../../mocks/like.service.mock';
import { createMockMatchService } from '../../mocks/match.service.mock';
import { createMockUserService } from '../../mocks/user.service.mock';
import { createMockViewService } from '../../mocks/view.service.mock';
import type { FilterModel } from '../../../src/domain/model/filters-model';
import { EntityNotFoundException } from '../../../src/shared/exception/EntityNotFoundException';
import { ForbiddenException } from '@nestjs/common';

describe('SwipeService', () => {
  let service: SwipeService;

  let mockUserService: ReturnType<typeof createMockUserService>;
  let mockViewService: ReturnType<typeof createMockViewService>;
  let mockMatchService: ReturnType<typeof createMockMatchService>;
  let mockLikeService: ReturnType<typeof createMockLikeService>;

  const mockFilters: FilterModel[] = [
    {
      gender: 'WOMAN',
      sexualOrientation: 'HETEROSEXUAL',
    },
    {
      gender: 'MAN',
      sexualOrientation: 'HETEROSEXUAL',
    },
  ];

  beforeEach(async () => {
    mockUserService = createMockUserService();
    mockViewService = createMockViewService();
    mockMatchService = createMockMatchService();
    mockLikeService = createMockLikeService();

    const moduleRef = await Test.createTestingModule({
      providers: [
        SwipeService,
        { provide: UserService, useValue: mockUserService },
        { provide: ViewService, useValue: mockViewService },
        { provide: MatchService, useValue: mockMatchService },
        { provide: LikeService, useValue: mockLikeService },
      ],
    }).compile();

    service = moduleRef.get<SwipeService>(SwipeService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPotentialMatches', () => {
    it('should be can find potential matches', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      (mockViewService.findPotentialMatchesIds as jest.Mock).mockResolvedValue([
        'viewedUserId1',
        'viewedUserId2',
      ]);
      (mockUserService.findPotentialMatches as jest.Mock).mockResolvedValue([
        { id: 'user1', name: 'User 1' },
        { id: 'user2', name: 'User 2' },
      ]);

      // Act
      const potentialMatches = await service.findPotentialMatches(userId);

      // Assert
      expect(potentialMatches).toEqual([
        { id: 'user1', name: 'User 1' },
        { id: 'user2', name: 'User 2' },
      ]);
      expect(
        mockUserService.verifyUserExistsAndGetYourFilters,
      ).toHaveBeenCalled();
      expect(mockViewService.findPotentialMatchesIds).toHaveBeenCalledWith(
        userId,
        service['POTENTIAL_MATCH_LIMIT'],
      );
      expect(mockUserService.findPotentialMatches).toHaveBeenCalledWith(
        userId,
        ['viewedUserId1', 'viewedUserId2'],
        ['WOMAN', 'MAN'],
        ['HETEROSEXUAL'],
        service['POTENTIAL_MATCH_LIMIT'],
      );
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockRejectedValue(new EntityNotFoundException('user'));

      // Act & Assert
      await expect(service.findPotentialMatches(userId)).rejects.toThrow(
        new EntityNotFoundException('user'),
      );
      expect(
        mockUserService.verifyUserExistsAndGetYourFilters,
      ).toHaveBeenCalledWith(userId);
    });

    it('should return an empty array if no viewed users are found', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      (mockViewService.findPotentialMatchesIds as jest.Mock).mockResolvedValue(
        [],
      );

      // Act
      const potentialMatches = await service.findPotentialMatches(userId);

      // Assert
      expect(potentialMatches).toEqual([]);
      expect(
        mockUserService.verifyUserExistsAndGetYourFilters,
      ).toHaveBeenCalledWith(userId);
      expect(mockViewService.findPotentialMatchesIds).toHaveBeenCalledWith(
        userId,
        service['POTENTIAL_MATCH_LIMIT'],
      );
    });
  });

  describe('swipeProfile', () => {
    it('should register a like and create a match', async () => {
      // Arrange
      const userId = 'userId';
      const swipedUserId = 'swipedUserId';
      const liked = true;
      (mockViewService.registerView as jest.Mock).mockResolvedValue(undefined);
      (mockLikeService.registerLike as jest.Mock).mockResolvedValue(true);
      (mockMatchService.registerMatch as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      await service.swipeProfile(userId, swipedUserId, liked);

      // Assert
      expect(mockViewService.registerView).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockLikeService.registerLike).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockMatchService.registerMatch).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
    });

    it('should register a view without creating a match', async () => {
      // Arrange
      const userId = 'userId';
      const swipedUserId = 'swipedUserId';
      const liked = true;
      (mockViewService.registerView as jest.Mock).mockResolvedValue(undefined);
      (mockLikeService.registerLike as jest.Mock).mockResolvedValue(false);
      (mockMatchService.registerMatch as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      await service.swipeProfile(userId, swipedUserId, liked);

      // Assert
      expect(mockViewService.registerView).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockLikeService.registerLike).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockMatchService.registerMatch).not.toHaveBeenCalled();
    });

    it('should throw an error if the user swipes their own profile', async () => {
      // Arrange
      const userId = 'userId';
      const swipedUserId = 'userId'; // Same as userId
      const liked = true;

      // Act & Assert
      await expect(
        service.swipeProfile(userId, swipedUserId, liked),
      ).rejects.toThrow(
        new ForbiddenException('You cannot swipe your own profile.'),
      );
      expect(mockViewService.registerView).not.toHaveBeenCalled();
      expect(mockLikeService.registerLike).not.toHaveBeenCalled();
      expect(mockMatchService.registerMatch).not.toHaveBeenCalled();
    });

    it('should just register a view if the like is false', async () => {
      // Arrange
      const userId = 'userId';
      const swipedUserId = 'swipedUserId';
      const liked = false;
      (mockViewService.registerView as jest.Mock).mockResolvedValue(undefined);
      (mockLikeService.registerLike as jest.Mock).mockResolvedValue(false);
      (mockMatchService.registerMatch as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      await service.swipeProfile(userId, swipedUserId, liked);

      // Assert
      expect(mockViewService.registerView).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockLikeService.registerLike).not.toHaveBeenCalled();
      expect(mockMatchService.registerMatch).not.toHaveBeenCalled();
    });

    it('should like a profile and not create a match', async () => {
      // Arrange
      const userId = 'userId';
      const swipedUserId = 'swipedUserId';
      const liked = true;
      (mockViewService.registerView as jest.Mock).mockResolvedValue(undefined);
      (mockLikeService.registerLike as jest.Mock).mockResolvedValue(false);
      (mockMatchService.registerMatch as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      await service.swipeProfile(userId, swipedUserId, liked);

      // Assert
      expect(mockViewService.registerView).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockLikeService.registerLike).toHaveBeenCalledWith(
        userId,
        swipedUserId,
      );
      expect(mockMatchService.registerMatch).not.toHaveBeenCalled();
    });
  });

  describe('getMatches', () => {
    it('should return matches for a user', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      (mockMatchService.getMatchesByUserId as jest.Mock).mockResolvedValue([
        'matchId1',
        'matchId2',
      ]);
      (mockUserService.findUsersByIds as jest.Mock).mockResolvedValue([
        { id: 'matchId1', name: 'Match 1' },
        { id: 'matchId2', name: 'Match 2' },
      ]);
      service['MATCHES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30,
      );

      // Act
      const matches = await service.getMatches(userId);

      // Assert
      expect(matches).toEqual([
        { id: 'matchId1', name: 'Match 1' },
        { id: 'matchId2', name: 'Match 2' },
      ]);
    });

    it('should throw an error if the user does not exist', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockRejectedValue(new EntityNotFoundException('user'));
      service['MATCHES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30,
      );

      // Act & Assert
      await expect(service.getMatches(userId)).rejects.toThrow(
        new EntityNotFoundException('user'),
      );
    });

    it('should return an empty array if no matches are found', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      (mockMatchService.getMatchesByUserId as jest.Mock).mockResolvedValue([]);
      service['MATCHES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30,
      );

      // Act
      const matches = await service.getMatches(userId);

      // Assert
      expect(matches).toEqual([]);
    });

    it('should throw an error if the matches feature is not available', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      service['MATCHES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
      );

      // Act & Assert
      await expect(service.getMatches(userId)).rejects.toThrow(
        new ForbiddenException(
          'This feature is not available yet. Please check back later.',
        ),
      );
    });
  });

  describe('getLikedProfiles', () => {
    it('should return liked profiles for a user', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      (mockLikeService.getLikedProfiles as jest.Mock).mockResolvedValue([
        'likedProfileId1',
        'likedProfileId2',
      ]);
      (mockUserService.findUsersByIds as jest.Mock).mockResolvedValue([
        { id: 'likedProfileId1', name: 'Liked Profile 1' },
        { id: 'likedProfileId2', name: 'Liked Profile 2' },
      ]);
      service['LIKED_PROFILES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30,
      );

      // Act
      const likedProfiles = await service.getLikedProfiles(userId);

      // Assert
      expect(likedProfiles).toEqual([
        { id: 'likedProfileId1', name: 'Liked Profile 1' },
        { id: 'likedProfileId2', name: 'Liked Profile 2' },
      ]);
    });

    it('should throw an error if the user does not exist', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockRejectedValue(new EntityNotFoundException('user'));
      service['LIKED_PROFILES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30,
      );

      // Act & Assert
      await expect(service.getLikedProfiles(userId)).rejects.toThrow(
        new EntityNotFoundException('user'),
      );
    });

    it('should return an empty array if no liked profiles are found', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      (mockLikeService.getLikedProfiles as jest.Mock).mockResolvedValue([]);
      service['LIKED_PROFILES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30,
      );

      // Act
      const likedProfiles = await service.getLikedProfiles(userId);

      // Assert
      expect(likedProfiles).toEqual([]);
    });

    it('should throw an error if the liked profiles feature is not available', async () => {
      // Arrange
      const userId = 'userId';
      (
        mockUserService.verifyUserExistsAndGetYourFilters as jest.Mock
      ).mockResolvedValue(mockFilters);
      service['LIKED_PROFILES_AVAILABLE_DATE'] = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
      );

      // Act & Assert
      await expect(service.getLikedProfiles(userId)).rejects.toThrow(
        new ForbiddenException(
          'This feature is not available yet. Please check back later.',
        ),
      );
    });
  });
});
