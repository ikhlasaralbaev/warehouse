import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/units/entities/unit.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Unit) private readonly unitRepository: Repository<Unit>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const unit = await this.unitRepository.findOne({
      where: { id: createProductDto.unit },
    });

    const createdBy = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!unit)
      throw new BadRequestException('Unit with that id is not defined!');

    return this.productRepository.save({
      ...createProductDto,
      unit,
      createdBy,
    });
  }

  async findAll() {
    return this.productRepository.find({
      relations: ['unit', 'createdBy'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const data = await this.productRepository.findOne({
      where: { id },
      relations: [
        'unit',
        'createdBy',
        'incomeTransactions',
        'transactionProducts',
        'transactionProducts.transaction',
        'transactionProducts.transaction.team',
      ],
    });

    if (!data) {
      throw new BadRequestException('Product with that id is not defined!');
    }

    return data;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const unit = await this.unitRepository.findOne({
      where: { id: updateProductDto.unit },
    });

    const data = await this.productRepository.update(id, {
      ...updateProductDto,
      unit,
    });

    if (data.affected) {
      return this.productRepository.findOne({ where: { id } });
    } else {
      throw new BadRequestException('Product with that id is not defined!');
    }
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  
}
