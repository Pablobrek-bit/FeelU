import type { RoleService } from '../../src/application/service/role.service';

export const createMockRoleService = (): jest.Mocked<Partial<RoleService>> => ({
  existRoleByName: jest.fn(),
});
