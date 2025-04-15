import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/application/service/auth.service';
import { createMockUserRepository } from '../../mocks/user.repository.mock';
import { UserRepository } from '../../../src/application/ports/user.repository';
import { createMockJwtService } from '../../mocks/jwt.service.mock';
import { JwtService } from '@nestjs/jwt';
import type { LoginUserSchema } from '../../../src/application/dto/user/login-user-schema';
import { compare } from 'bcryptjs';

// Mock the bcryptjs module
jest.mock('bcryptjs');
// Cast compare to jest.Mock after mocking the module
const compareMock = compare as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;

  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockJwtService: ReturnType<typeof createMockJwtService>;

  const mockLoginData: LoginUserSchema = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockUser = {
    id: 'user-id',
    email: mockLoginData.email,
    password: 'hashed-password',
    role: { id: 'role-uuid', name: 'USER' },
  };

  beforeEach(async () => {
    mockUserRepository = createMockUserRepository();
    mockJwtService = createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks before each test
    jest.clearAllMocks();
    compareMock.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should be return a token on sucessful login', async () => {
      // Arrange
      const mockToken = 'mock-jwt-token';
      (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue(
        mockUser,
      );

      compareMock.mockResolvedValue(true);
      (mockJwtService.sign as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await service.login(mockLoginData);

      // Assert
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
      expect(compareMock).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        role: mockUser.role.name,
      });
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(mockLoginData)).rejects.toThrowError(
        'Invalid email or password',
      );
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
    });

    it('should throw an error if password is invalid', async () => {
      // Arrange
      (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue(
        mockUser,
      );
      // Use the correctly typed mock
      compareMock.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(mockLoginData)).rejects.toThrowError(
        'Invalid email or password',
      );
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
      expect(compareMock).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUser.password,
      );
    });
  });
});
