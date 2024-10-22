import { Role } from './../roles/entities/role.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { In } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const candidate = await this.findByEmail(createUserDto.email);

    if (candidate)
      throw new BadRequestException('User with that email is already exist!');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const roles = await this.roleRepository.find({
      where: {
        id: In(createUserDto.roles),
      },
    });

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles,
    });

    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roles, ...data } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'], // Load roles relation
    });

    if (!user) throw new BadRequestException('User not found');

    const oldUser = await this.findByEmail(data.email);

    if (oldUser && oldUser.id !== id)
      throw new BadRequestException('User with that email is already exist!');

    let rolesData = [];

    if (roles && roles.length > 0) {
      // Fetch the roles from the database using the role IDs
      rolesData = await this.roleRepository.find({
        where: {
          id: In(roles),
        },
      });

      // Check if all roles provided exist
      if (rolesData.length !== roles.length) {
        throw new BadRequestException('Invalid roles provided');
      }
    }

    user.roles = rolesData.length > 0 ? rolesData : user.roles; // Update roles if provided, otherwise keep existing
    Object.assign(user, data); // Assign other data fields from updateUserDto

    await this.userRepository.save(user);

    return user; // Optionally return the updated user
  }

  async remove(id: number) {
    const deleted = this.userRepository.delete(id);

    if (!deleted) throw new BadRequestException('User not found');

    return deleted;
  }

  async findByEmail(email: string) {
    const candidate = await this.userRepository.findOne({ where: { email } });
    return candidate;
  }
}
