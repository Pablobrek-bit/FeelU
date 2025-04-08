import { RoleRepository } from '../ports/role.repository';

export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async existRoleByName(roleName: string): Promise<string | null> {
    const roleId = await this.roleRepository.findRoleByName(roleName);

    return roleId;
  }
}
