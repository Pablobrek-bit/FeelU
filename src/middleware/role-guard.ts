import type { CanActivate, ExecutionContext } from '@nestjs/common';

export class RoleGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.allowedRoles.includes(user.role);
  }
}
