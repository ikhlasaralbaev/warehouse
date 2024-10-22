import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { ICreateExpence, ICreateIncome } from './types/balances.types';
import { Income } from './entities/incomes.entity';
import { Expence } from './entities/expences.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Balance) private balanceRepository: Repository<Balance>,
    @InjectRepository(Income) private incomeRepository: Repository<Income>,
    @InjectRepository(Expence) private expenceRepository: Repository<Expence>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(): Promise<Balance> {
    const balance = new Balance();
    balance.name = 'Main balance';
    return this.balanceRepository.save(balance);
  }

  async findAll(): Promise<Balance[]> {
    return this.balanceRepository.find();
  }

  async createIncome(data: ICreateIncome) {
    const income = this.incomeRepository.create({
      ...data,
    });

    await this.addToMainBalance(data.amount);

    return await this.incomeRepository.save(income);
  }

  async createExpence(data: ICreateExpence) {
    const product = await this.productRepository.findOne({
      where: { id: data.product.id },
    });

    if (!product) throw new Error('Product not found');

    const balance = await this.getMainBalance();

    const expence = this.expenceRepository.create({
      ...data,
      product,
      balance,
    });

    await this.subtractFromMainBalance(data.amount);

    return await this.expenceRepository.save(expence);
  }

  async getIncomes(): Promise<Income[]> {
    return this.incomeRepository.find({
      relations: [
        'balance',
        'transaction',
        'transaction.team',
        'transaction.createdBy',
      ],
    });
  }

  async getExpences(): Promise<Expence[]> {
    return this.expenceRepository.find({
      relations: ['balance', 'product'],
    });
  }

  async addToMainBalance(amount: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: {
        id: 1,
      },
    });
    balance.amount += amount;
    return this.balanceRepository.save(balance);
  }

  async subtractFromMainBalance(amount: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: {
        id: 1,
      },
    });
    balance.amount -= amount;
    return this.balanceRepository.save(balance);
  }

  async getMainBalance(): Promise<Balance> {
    return this.balanceRepository.findOne({
      where: {
        id: 1,
      },
    });
  }

  async addToWarehouseBalance(amount: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: {
        id: 1,
      },
    });
    balance.warehouseBalance += amount;
    return this.balanceRepository.save(balance);
  }

  async subtractFromWarehouseBalance(amount: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: {
        id: 1,
      },
    });
    balance.warehouseBalance -= amount;
    return this.balanceRepository.save(balance);
  }
}
