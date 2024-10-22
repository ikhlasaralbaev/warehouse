import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { IncomeProductEntity } from './entites/income.entity';
import { IncomeProductController } from './income_product.controller';
import { IncomeProductService } from './income_product.service';
import { Balance } from 'src/balances/entities/balance.entity';
import { Income } from 'src/balances/entities/incomes.entity';
import { Expence } from 'src/balances/entities/expences.entity';
import { BalancesService } from 'src/balances/balances.service';

@Module({
  controllers: [IncomeProductController],
  providers: [IncomeProductService, BalancesService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      IncomeProductEntity,
      Balance,
      Income,
      Expence,
    ]),
  ],
})
export class IncomeProductModule {}
