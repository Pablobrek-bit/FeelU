import type { FilterService } from '../../src/application/service/filter.service';

export const createMockFilterService = (): jest.Mocked<
  Partial<FilterService>
> => ({
  createFilter: jest.fn(),
  updateFilter: jest.fn(),
});
