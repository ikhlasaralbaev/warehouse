import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { ILike, type Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const permission = createPermissionDto.name;
    const action = createPermissionDto.action;

    const old = await this.permissionRepository.find({
      where: {
        name: permission,
        action: action,
      },
    });

    if (old.find((p) => p.action === action)) {
      throw new BadRequestException('Permission already exists');
    }

    return this.permissionRepository.save({ name: permission, action });
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
