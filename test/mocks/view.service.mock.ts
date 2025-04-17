import type { ViewService } from '../../src/application/service/view.service';

export const createMockViewService = (): jest.Mocked<Partial<ViewService>> => ({
  findPotentialMatchesIds: jest.fn(),
  registerView: jest.fn(),
});
