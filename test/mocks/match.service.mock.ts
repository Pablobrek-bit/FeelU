import type { MatchService } from '../../src/application/service/match.service';

export const createMockMatchService = (): jest.Mocked<
  Partial<MatchService>
> => ({
  registerMatch: jest.fn(),
  getMatchesByUserId: jest.fn(),
});
