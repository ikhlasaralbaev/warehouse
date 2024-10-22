import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalancesService } from 'src/balances/balances.service';
import { Product } from 'src/products/entities/product.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionProduct } from './entities/transaction-product.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(TransactionProduct)
    private transactionProductRepository: Repository<TransactionProduct>,

    private readonly balanceService: BalancesService,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async createTransaction(
    data: CreateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const team = await this.teamRepository.findOne({
      where: { id: data.team },
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    const products = await this.productRepository.findBy({
      id: In(data.products.map((product) => product.productId)),
    });

    if (products.length !== data.products.length) {
      throw new BadRequestException('Some products not found');
    }

    const transaction = await this.transactionRepository.save({
      createdBy: user,
      team,
      totalAmount: data.totalAmount,
      description: '',
    });

    for (const { productId, quantity } of data.products) {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (product.quantity < quantity) {
        await this.transactionRepository.delete(transaction.id);

        throw new BadRequestException(
          `Not enough quantity for product ${product.name} in stock`,
        );
      }

      product.quantity -= quantity;
      await this.productRepository.save(product);

      const transactionProduct = new TransactionProduct();

      transactionProduct.transaction = transaction;
      transactionProduct.product = product;
      transactionProduct.quantity = quantity;



      await this.transactionProductRepository.save(transactionProduct);
    }

    await this.balanceService.createIncome({
      amount: data.totalAmount,
      description: 'Transaction',
      transaction: transaction,
      balanceId: 1,
    });

    return this.getTransactionById(transaction.id);
  }

  async getTransactionById(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'transactionProducts',
        'transactionProducts.product',
        'team',
      ],
    });
  }

  async getAllTransactions(page: number) {
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        relations: [
          'createdBy',
          'transactionProducts',
          'transactionProducts.product',
          'team',
          'transactionProducts.product.unit',
        ],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * 10,
        take: 10,
      },
    );

    return {
      data: transactions,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / 10),
    };
  }
}
