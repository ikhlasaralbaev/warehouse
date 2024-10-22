import { PermissionsGuard } from './../guards/permissions.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { Permissions } from './permission.decorator';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles('admin'));
}

export function AuthPermission(...permissions: string[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PermissionsGuard),
    Permissions(...permissions),
  );
}
