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
import type { UpdateUserSchema } from '../../../src/application/dto/user/update-user-schema';
import { EntityNotFoundException } from '../../../src/shared/exception/EntityNotFoundException';
import type { UserModel } from '../../../src/domain/model/user-model';
import type { Gender, SexualOrientation } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

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

  const userUpdateData: UpdateUserSchema = {
    filters: [
      {
        gender: 'WOMAN',
        sexualOrientations: ['HETEROSEXUAL'],
      },
      {
        gender: 'MAN',
        sexualOrientations: ['HETEROSEXUAL'],
      },
    ],
    password: 'newpassword123',
    profile: {
      bio: 'Updated bio',
      course: 'Updated course',
      emoji: '👩‍💻',
      genderIsVisible: false,
      instagramUrl: 'https://instagram.com/updated',
      institution: 'Updated University',
      sexualOrientationVisible: false,
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

  describe('updateUserDetails', () => {
    it('should update user details', async () => {
      // Arrange
      const userId = '123';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockFirebaseStorageService.uploadFile as jest.Mock).mockResolvedValue(
        'https://example.com/new-avatar.jpg',
      );
      (mockFirebaseStorageService.deleteFile as jest.Mock).mockResolvedValue(
        true,
      );
      (mockProfileService.getAvatarUrlByUserId as jest.Mock).mockResolvedValue(
        'https://example.com/old-avatar.jpg',
      );

      // Act
      await service.updateUserDetails(userUpdateData, userId, mockAvatar);

      // Assert
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUserPassword).toHaveBeenCalledWith(
        userId,
        expect.any(String),
      );
      expect(mockFirebaseStorageService.deleteFile).toHaveBeenCalledWith(
        'https://example.com/old-avatar.jpg',
      );
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userUpdateData.profile,
        userId,
        'https://example.com/new-avatar.jpg',
      );
      expect(mockFilterService.updateFilter).toHaveBeenCalledWith(
        userUpdateData.filters,
        userId,
      );
      expect(mockFirebaseStorageService.uploadFile).toHaveBeenCalledWith(
        mockAvatar,
      );
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue(null);

      const userId = 'non-existing-id';

      // Act & Assert
      await expect(
        service.updateUserDetails(userUpdateData, userId, mockAvatar),
      ).rejects.toThrow(EntityNotFoundException);
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUserPassword).not.toHaveBeenCalled();
      expect(mockFirebaseStorageService.deleteFile).not.toHaveBeenCalled();
      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
      expect(mockFilterService.updateFilter).not.toHaveBeenCalled();
      expect(mockFirebaseStorageService.uploadFile).not.toHaveBeenCalled();
    });

    it('should update user details without changing password or avatar', async () => {
      // Arrange
      const userId = '123';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockFirebaseStorageService.uploadFile as jest.Mock).mockResolvedValue(
        'https://example.com/new-avatar.jpg',
      );
      (mockFirebaseStorageService.deleteFile as jest.Mock).mockResolvedValue(
        true,
      );
      (mockProfileService.getAvatarUrlByUserId as jest.Mock).mockResolvedValue(
        'https://example.com/old-avatar.jpg',
      );
      userUpdateData.password = undefined;
      userUpdateData.filters = undefined;

      // Act
      await service.updateUserDetails(userUpdateData, userId);

      // Assert
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUserPassword).not.toHaveBeenCalled();
      expect(mockFirebaseStorageService.deleteFile).not.toHaveBeenCalled();
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userUpdateData.profile,
        userId,
        undefined,
      );
      expect(mockFilterService.updateFilter).toHaveBeenCalledWith(
        userUpdateData.filters,
        userId,
      );
    });

    it('should update user details without changing avatar', async () => {
      // Arrange
      const userId = '123';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockFirebaseStorageService.uploadFile as jest.Mock).mockResolvedValue(
        'https://example.com/new-avatar.jpg',
      );
      (mockFirebaseStorageService.deleteFile as jest.Mock).mockResolvedValue(
        true,
      );
      (mockProfileService.getAvatarUrlByUserId as jest.Mock).mockResolvedValue(
        'https://example.com/old-avatar.jpg',
      );
      userUpdateData.password = undefined;
      userUpdateData.filters = undefined;

      userUpdateData.profile = {
        ...userUpdateData.profile,
        emoji: undefined,
      };
      // Act
      await service.updateUserDetails(userUpdateData, userId);

      // Assert

      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUserPassword).not.toHaveBeenCalled();
      expect(mockFirebaseStorageService.deleteFile).not.toHaveBeenCalled();
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userUpdateData.profile,
        userId,
        undefined,
      );
      expect(mockFilterService.updateFilter).toHaveBeenCalledWith(
        userUpdateData.filters,
        userId,
      );
    });

    it('should update user details without changing password and filters', async () => {
      // Arrange
      const userId = '123';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockFirebaseStorageService.uploadFile as jest.Mock).mockResolvedValue(
        'https://example.com/new-avatar.jpg',
      );
      (mockFirebaseStorageService.deleteFile as jest.Mock).mockResolvedValue(
        true,
      );
      (mockProfileService.getAvatarUrlByUserId as jest.Mock).mockResolvedValue(
        'https://example.com/old-avatar.jpg',
      );
      userUpdateData.password = undefined;
      userUpdateData.filters = undefined;

      // Act
      await service.updateUserDetails(userUpdateData, userId);

      // Assert
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUserPassword).not.toHaveBeenCalled();
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userUpdateData.profile,
        userId,
        undefined,
      );
    });

    it('should update user details without changing the profile', async () => {
      // Arrange
      const userId = '123';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockFirebaseStorageService.uploadFile as jest.Mock).mockResolvedValue(
        'https://example.com/new-avatar.jpg',
      );
      (mockFirebaseStorageService.deleteFile as jest.Mock).mockResolvedValue(
        true,
      );
      (mockProfileService.getAvatarUrlByUserId as jest.Mock).mockResolvedValue(
        'https://example.com/old-avatar.jpg',
      );
      userUpdateData.password = undefined;
      userUpdateData.profile = undefined;

      // Act
      await service.updateUserDetails(userUpdateData, userId);

      // Assert
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUserPassword).not.toHaveBeenCalled();
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userUpdateData.profile,
        userId,
        undefined,
      );
    });
  });

  describe('getUserById', () => {
    it('should return user details by ID', async () => {
      // Assert
      const userId = '123';
      const expectedUser = { id: userId, name: 'John Doe' };
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(expectedUser);

      // Act
      const result = await service.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange
      const userId = 'non-existing-id';
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserById(userId)).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
    });
  });

  describe('changeUserRole', () => {
    it('should change user role', async () => {
      // Arrange
      const userId = '123';
      const roleName = 'admin';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockRoleService.existRoleByName as jest.Mock).mockResolvedValue({
        id: 'role-id',
      });

      // Act
      await service.changeUserRole(userId, roleName);

      // Assert
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockRoleService.existRoleByName).toHaveBeenCalledWith(roleName);
      expect(mockUserRepository.updateUserRole).toHaveBeenCalledWith(
        userId,
        roleName,
      );
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange
      const userId = 'non-existing-id';
      const roleName = 'admin';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.changeUserRole(userId, roleName)).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockRoleService.existRoleByName).toHaveBeenCalledWith(roleName);
      expect(mockUserRepository.updateUserRole).not.toHaveBeenCalled();
    });

    it('should throw an error if role does not exist', async () => {
      // Arrange
      const userId = '123';
      const roleName = 'non-existing-role';
      (mockUserRepository.existUserById as jest.Mock).mockResolvedValue({
        id: userId,
      });
      (mockRoleService.existRoleByName as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.changeUserRole(userId, roleName)).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(mockUserRepository.existUserById).toHaveBeenCalledWith(userId);
      expect(mockRoleService.existRoleByName).toHaveBeenCalledWith(roleName);
      expect(mockUserRepository.updateUserRole).not.toHaveBeenCalled();
    });
  });

  describe('findPotentialMatches', () => {
    it('should return potential matches', async () => {
      // Arrange
      const userId = '123';
      const viewedUserIds = ['456', '789'];
      const genders: Gender[] = ['MAN', 'WOMAN'];
      const sexualOrientations: SexualOrientation[] = [
        'HETEROSEXUAL',
        'BISEXUAL',
      ];
      const limit = 10;

      const mockPotencialMatches: UserModel[] = [
        {
          id: '456',
          name: 'Jane Doe',
          age: 30,
          avatarUrl: 'https://example.com/avatar.jpg',
          bio: 'Hello, world!',
          gender: 'WOMAN',
          sexualOrientation: 'HETEROSEXUAL',
          showGender: true,
          showSexualOrientation: true,
          course: 'Computer Science',
          institution: 'University of Example',
          emoji: '👩‍💻',
          instagramUrl: 'https://instagram.com/example',
        },
        {
          id: '789',
          name: 'John Smith',
          age: 28,
          avatarUrl: 'https://example.com/avatar2.jpg',
          bio: 'Nice to meet you!',
          gender: 'MAN',
          sexualOrientation: 'HETEROSEXUAL',
          showGender: true,
          showSexualOrientation: true,
          course: 'Mathematics',
          institution: 'University of Example 2',
          emoji: '👨‍💻',
          instagramUrl: 'https://instagram.com/example2',
        },
      ];
      (mockUserRepository.findPotentialMatches as jest.Mock).mockResolvedValue(
        mockPotencialMatches,
      );

      // Act
      const result = await service.findPotentialMatches(
        userId,
        viewedUserIds,
        genders,
        sexualOrientations,
        limit,
      );

      // Assert
      expect(mockUserRepository.findPotentialMatches).toHaveBeenCalledWith(
        userId,
        viewedUserIds,
        genders,
        sexualOrientations,
        limit,
      );
      expect(result).toEqual(mockPotencialMatches);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      // Arrange
      const token = 'verification-token';
      const userId = 'user-id';
      (
        mockUserRepository.findUserByVerificationToken as jest.Mock
      ).mockResolvedValue(userId);
      (
        mockUserRepository.updateUserVerificationToken as jest.Mock
      ).mockResolvedValue(undefined);

      // Act
      await service.verifyEmail(token);

      // Assert
      expect(
        mockUserRepository.findUserByVerificationToken,
      ).toHaveBeenCalledWith(token);
      expect(
        mockUserRepository.updateUserVerificationToken,
      ).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      const token = 'invalid-token';
      (
        mockUserRepository.findUserByVerificationToken as jest.Mock
      ).mockResolvedValue(null);

      // Act & Assert
      await expect(service.verifyEmail(token)).rejects.toThrow(
        NotFoundException,
      );
      expect(
        mockUserRepository.findUserByVerificationToken,
      ).toHaveBeenCalledWith(token);
      expect(
        mockUserRepository.updateUserVerificationToken,
      ).not.toHaveBeenCalled();
    });
  });
});
