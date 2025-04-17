import type { UserService } from '../../src/application/service/user.service';

export const createMockUserService = (): jest.Mocked<Partial<UserService>> => ({
  findUsersByIds: jest.fn(),
  findPotentialMatches: jest.fn(),
  verifyUserExistsAndGetYourFilters: jest.fn(),
});
