import type { ProfileService } from '../../src/application/service/profile.service';

export const createMockProfileService = (): jest.Mocked<
  Partial<ProfileService>
> => ({
  createProfile: jest.fn(),
  getAvatarUrlByUserId: jest.fn(),
  updateProfile: jest.fn(),
});
