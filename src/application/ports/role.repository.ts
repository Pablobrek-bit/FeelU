export abstract class RoleRepository {
  abstract findRoleByName(roleName: string): Promise<string | null>;
}
