import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionProduct {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.transactionProducts, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.transactionProducts,
    {
      onDelete: 'CASCADE',
    },
  )
  transaction: Transaction;

  @CreateDateColumn()
  createdAt: Date;
}
