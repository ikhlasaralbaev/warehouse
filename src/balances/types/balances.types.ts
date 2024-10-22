import { Product } from 'src/products/entities/product.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

export interface ICreateIncome {
  amount: number;
  description: string;
  balanceId: number;
  transaction: Transaction;
}

export interface ICreateExpence {
  amount: number;
  description: string;
  balance: number;
  product: Product;
}
