import type { UserRepository } from '../../src/application/ports/user.repository';

export const createMockUserRepository = (): Partial<UserRepository> => ({
  existUserByEmail: jest.fn(),
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  existUserById: jest.fn(),
  existUserByIdAndGetYourFilters: jest.fn(),
  findPotentialMatches: jest.fn(),
  findUserByIds: jest.fn(),
  findUserByVerificationToken: jest.fn(),
  getById: jest.fn(),
  softDeleteUser: jest.fn(),
  updateUserPassword: jest.fn(),
  updateUserRole: jest.fn(),
  updateUserVerificationToken: jest.fn(),
});
