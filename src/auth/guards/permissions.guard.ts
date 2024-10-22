// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import type { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const reqPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!reqPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const userRoles = user.roles;
    const userPermissions = userRoles.reduce((acc, role) => {
      acc.push(...role.permissions.map((perm) => perm));
      return acc;
    }, []);

    const hasPermission = reqPermissions.every((permission) =>
      userPermissions.find(
        (item) =>
          (item.name === permission && item.action === 'all') ||
          item.action === permission.split(':')[1],
      ),
    );

    return hasPermission;
  }
}
