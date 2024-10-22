import { IsEnum, IsString } from 'class-validator';

export enum PermissionActions {
  ALL = 'all',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsEnum(PermissionActions)
  action: PermissionActions;
}
