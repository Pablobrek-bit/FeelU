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

describe('SwipeService', () => {
  let service: SwipeService;

  let mockUserService: ReturnType<typeof createMockUserService>;
  let mockViewService: ReturnType<typeof createMockViewService>;
  let mockMatchService: ReturnType<typeof createMockMatchService>;
  let mockLikeService: ReturnType<typeof createMockLikeService>;

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
});
