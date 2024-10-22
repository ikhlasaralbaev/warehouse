import { IsArray, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  roles: number[];
}
