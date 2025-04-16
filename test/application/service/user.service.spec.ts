/* eslint-disable @typescript-eslint/no-require-imports */
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
import type { CreateUserSchema } from '../../../src/application/dto/user/create-user-schema';
import { UserAlreadyExistsError } from '../../../src/shared/exception/UserAlreadyExistsError';

describe('UserService', () => {
  let service: UserService;

  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockFilterService: ReturnType<typeof createMockFilterService>;
  let mockProfileService: ReturnType<typeof createMockProfileService>;
  let mockEmailService: ReturnType<typeof createMockEmailService>;
  let mockRoleService: ReturnType<typeof createMockRoleService>;
  let mockFirebaseStorageService: ReturnType<
    typeof createMockFirebaseStorageService
  >;
  let mockLikeService: ReturnType<typeof createMockLikeService>;

  const userCreateData: CreateUserSchema = {
    email: 'test@example.com',
    password: 'password123',
    filters: [
      {
        gender: 'MAN',
        sexualOrientations: ['HETEROSEXUAL'],
      },
      {
        gender: 'WOMAN',
        sexualOrientations: ['HETEROSEXUAL'],
      },
    ],
    profile: {
      age: 25,
      name: 'John Doe',
      bio: 'Hello, world!',
      course: 'Computer Science',
      institution: 'University of Example',
      emoji: '👨‍💻',
      gender: 'MAN',
      genderIsVisible: true,
      sexualOrientation: 'HETEROSEXUAL',
      sexualOrientationVisible: true,
      instagramUrl: 'https://instagram.com/example',
    },
  };

  const mockAvatar: Express.Multer.File = {
    buffer: Buffer.from('mock-avatar-data'),
    originalname: 'avatar.jpg',
    destination: 'uploads/',
    filename: 'avatar.jpg',
    fieldname: 'avatar',
    mimetype: 'image/jpg',
    path: 'uploads/avatar.jpg',
    size: 12345,
    stream: new (require('stream').Readable)(),
    encoding: '7bit',
  };

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

  describe('createUser', () => {
    it('should create a user with a profile and filters', async () => {
      // Arrange

      const mockAvatarUrl = 'https://example.com/avatar.jpg';
      (mockFirebaseStorageService.uploadFile as jest.Mock).mockResolvedValue(
        mockAvatarUrl,
      );

      // Act
      await service.createUser(userCreateData, mockAvatar);

      // Assert
      expect(mockUserRepository.existUserByEmail).toHaveBeenCalledWith(
        userCreateData.email,
      );
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
      expect(mockFirebaseStorageService.uploadFile).toHaveBeenCalledWith(
        mockAvatar,
      );
      expect(mockProfileService.createProfile).toHaveBeenCalledTimes(1);
      expect(mockFilterService.createFilter).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        userCreateData.email,
        expect.any(String),
      );
    });

    it('should throw an error if the user email already in use', async () => {
      // Arrange
      const existingEmail = 'existing@example.com';
      (mockUserRepository.existUserByEmail as jest.Mock).mockResolvedValue(
        true,
      );
      userCreateData.email = existingEmail;

      // Act & Assert
      await expect(
        service.createUser(userCreateData, mockAvatar),
      ).rejects.toThrow(UserAlreadyExistsError);
      expect(mockUserRepository.existUserByEmail).toHaveBeenCalledWith(
        existingEmail,
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
      expect(mockFirebaseStorageService.uploadFile).not.toHaveBeenCalled();
      expect(mockProfileService.createProfile).not.toHaveBeenCalled();
      expect(mockFilterService.createFilter).not.toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
      expect(mockFirebaseStorageService.uploadFile).not.toHaveBeenCalled();
    });
  });
});
