import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly unitRepo: Repository<Unit>,
  ) {}

  create(createUnitDto: CreateUnitDto) {
    return this.unitRepo.save(createUnitDto);
  }

  findAll() {
    return this.unitRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} unit`;
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  async remove(id: number) {
    return await this.unitRepo.delete(id);
  }
}
