import { RoleRepository } from '../../../application/ports/role.repository';
import { PrismaService } from '../../config/prisma.service';

export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRoleByName(roleName: string): Promise<string | null> {
    const role = await this.prisma.role.findFirst({
      where: {
        name: roleName,
      },
      select: {
        id: true,
      },
    });

    return role?.id ?? null;
  }
}
