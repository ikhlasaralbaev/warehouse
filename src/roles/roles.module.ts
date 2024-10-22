import { Role } from './entities/role.entity';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Permission } from '../permissions/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RolesController],
  providers: [RolesService],

  imports: [TypeOrmModule.forFeature([Role, Permission])],
})
export class RolesModule {}
