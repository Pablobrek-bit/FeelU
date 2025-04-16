import { type TestingModule, Test } from '@nestjs/testing';
import { UserRepository } from '../../../src/application/ports/user.repository';
import { EmailService } from '../../../src/application/service/email.service';
import { FilterService } from '../../../src/application/service/filter.service';
import { FirebaseStorageService } from '../../../src/application/service/firebase-storage.service';
import { LikeService } from '../../../src/application/service/like.service';
import { ProfileService } from '../../../src/application/service/profile.service';
import { RoleService } from '../../../src/application/service/role.service';
import { UserService } from '../../../src/application/service/user.service';
import { createMockEmailService } from '../../mocks/email.service.mock';
import { createMockFilterService } from '../../mocks/filter.service.mock';
import { createMockFirebaseStorageService } from '../../mocks/firebaseStorage.service.mock';
import { createMockLikeService } from '../../mocks/like.service.mock';
import { createMockProfileService } from '../../mocks/profile.service.mock';
import { createMockRoleService } from '../../mocks/role.service.mock';
import { createMockUserRepository } from '../../mocks/user.repository.mock';

describe('UserService', () => {
  let service: UserService;

  // Mock dependencies
  //     private readonly userRepository: UserRepository,
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  //     private readonly filterService: FilterService,
  let mockFilterService: ReturnType<typeof createMockFilterService>;
  //     private readonly profileService: ProfileService,
  let mockProfileService: ReturnType<typeof createMockProfileService>;
  //     private readonly emailService: EmailService,
  let mockEmailService: ReturnType<typeof createMockEmailService>;
  //     private readonly roleService: RoleService,
  let mockRoleService: ReturnType<typeof createMockRoleService>;
  //     private readonly firebaseStorageService: FirebaseStorageService,
  let mockFirebaseStorageService: ReturnType<
    typeof createMockFirebaseStorageService
  >;
  //     private readonly likeService: LikeService,
  let mockLikeService: ReturnType<typeof createMockLikeService>;

  beforeEach(async () => {
    mockUserRepository = createMockUserRepository();
    mockFilterService = createMockFilterService();
    mockProfileService = createMockProfileService();
    mockEmailService = createMockEmailService();
    mockRoleService = createMockRoleService();
    mockFirebaseStorageService = createMockFirebaseStorageService();
    mockLikeService = createMockLikeService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: FilterService,
          useValue: mockFilterService,
        },
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: FirebaseStorageService,
          useValue: mockFirebaseStorageService,
        },
        {
          provide: LikeService,
          useValue: mockLikeService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
