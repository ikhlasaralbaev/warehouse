import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Team } from 'src/teams/entities/team.entity';
import { TransactionProduct } from './entities/transaction-product.entity';
import { BalancesService } from 'src/balances/balances.service';
import { Balance } from 'src/balances/entities/balance.entity';
import { Income } from 'src/balances/entities/incomes.entity';
import { Expence } from 'src/balances/entities/expences.entity';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, BalancesService],
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      User,
      Product,
      Team,
      TransactionProduct,
      Balance,
      Income,
      Expence,
    ]),
  ],
})
export class TransactionsModule {}
