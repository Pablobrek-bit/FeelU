import type { Role } from '@prisma/client';

export class UserModel {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public role: Role,
  ) {}
}
