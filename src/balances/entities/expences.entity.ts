import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  CreateDateColumn,
} from 'typeorm';
import { Balance } from './balance.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Expence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => Product, (product) => product.expences, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Balance, (balance) => balance.expenses, {
    onDelete: 'CASCADE',
  })
  balance: Balance;

  @CreateDateColumn()
  createdAt: Date;
}
