import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UnitsModule } from './units/units.module';
import { IncomeProductModule } from './income_product/income_product.module';
import { TeamsModule } from './teams/teams.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionProduct } from './transactions/entities/transaction-product.entity';
import { BalancesModule } from './balances/balances.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Disable in production
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    UnitsModule,
    IncomeProductModule,
    TeamsModule,
    TransactionsModule,
    TransactionProduct,
    BalancesModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
