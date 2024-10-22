import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const candidate = await this.findByPhone(createTeamDto.phone);

    if (candidate)
      throw new BadRequestException('Phone number is already exist!');

    return await this.teamRepository.save({
      fullName: createTeamDto.fullName || '',
      phone: createTeamDto.phone,
    });
  }

  async findAll(page: number = 1, search: string = '') {
    const [results, total] = await this.teamRepository.findAndCount({
      where: search
        ? {
            fullName: search,
          }
        : {},
      skip: (page - 1) * 10,
      take: 10,
      relations: ['transactions'],
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      data: results,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / 10),
    };
  }

  findOne(id: number) {
    const team = this.teamRepository.findOne({
      where: { id },
      relations: [
        'transactions',
        'transactions.transactionProducts',
        'transactions.transactionProducts.product',
        'transactions.createdBy',
      ],
    });

    if (!team) throw new BadRequestException('Team not found!');

    return team;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    const candidate = this.teamRepository.findOne({ where: { id } });

    if (!candidate) throw new BadRequestException('Team not found!');

    return this.teamRepository.update(id, updateTeamDto);
  }

  remove(id: number) {
    return this.teamRepository.delete(id);
  }

  async findByPhone(phone: string) {
    const candidate = await this.teamRepository.findOne({ where: { phone } });

    return candidate;
  }
}
