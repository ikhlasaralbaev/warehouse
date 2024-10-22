import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { Income } from './entities/incomes.entity';
import { Expence } from './entities/expences.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  controllers: [BalancesController],
  providers: [BalancesService],
  exports: [BalancesService],
  imports: [
    TypeOrmModule.forFeature([
      // Import the Balance entity
      Balance,
      Income,
      Expence,
      Product,
    ]),
  ],
})
export class BalancesModule {}
