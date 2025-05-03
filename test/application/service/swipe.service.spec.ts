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
  });
});
