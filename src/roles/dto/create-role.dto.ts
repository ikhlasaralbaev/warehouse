import { IsArray, IsNumber, IsString } from 'class-validator';
export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  permissions: number[];
}
