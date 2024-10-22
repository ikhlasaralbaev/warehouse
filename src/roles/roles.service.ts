import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { In, type Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const { name, permissions } = createRoleDto;

    const permissionsData = await this.permissionRepository.find({
      where: {
        id: In(permissions),
      },
    });

    if (permissionsData.length !== permissions.length) {
      throw new BadRequestException('Invalid permissions provided');
    }

    const role = this.roleRepository.create({
      name,
      permissions: permissionsData,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async findAll(page: number = 1) {
    const [results, total] = await this.roleRepository.findAndCount({
      relations: ['permissions'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * 10,
      take: 10,
    });

    return {
      data: results,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / 10),
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, permissions } = updateRoleDto;

    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'], // Load existing permissions
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    let permissionsData: Permission[] | null = null;

    if (permissions) {
      permissionsData = await this.permissionRepository.find({
        where: { id: In(permissions) },
      });

      if (permissionsData.length !== permissions.length) {
        throw new BadRequestException('Invalid permissions provided');
      }
    }

    // Update the role fields
    role.name = name || role.name; // Update the name if provided, else keep the existing name
    role.permissions = permissionsData || role.permissions; // Update the permissions if provided, else keep existing

    // Save the role entity with updated relations and fields
    await this.roleRepository.save(role);

    // Return the updated role, including its permissions
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
