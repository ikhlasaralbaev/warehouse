import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalancesService } from 'src/balances/balances.service';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { IncomeProduct } from './dto/income-product-dto';
import { IncomeProductEntity } from './entites/income.entity';

@Injectable()
export class IncomeProductService {
  constructor(
    @InjectRepository(IncomeProductEntity)
    private readonly incomeProductRepo: Repository<IncomeProductEntity>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly balanceService: BalancesService,
  ) {}

  async incomeProduct(body: IncomeProduct, user: User) {
    const userData = await this.userRepo.findOne({ where: { id: user.id } });

    if (!userData) throw new UnauthorizedException();

    const product = await this.productRepo.findOne({
      where: { id: body.product },
    });
    if (!product)
      throw new BadRequestException('Product with that id is not defined!');

    product.quantity += body.quantity;

    const transaction = await this.incomeProductRepo.save({
      quantity: body.quantity,
      createdBy: userData,
      product: product,
      totalPrice: body.totalPrice,
    });

    await this.productRepo.save(product);

    this.balanceService.createExpence({
      amount: body.totalPrice,
      description: 'Income product',
      product: product,
      balance: 1,
    });

    return {
      transaction,
      product,
    };
  }

  async getIncomeProduct(page: number = 1) {
    const [results, total] = await this.incomeProductRepo.findAndCount({
      relations: ['product', 'createdBy', 'product.unit'],
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
}
