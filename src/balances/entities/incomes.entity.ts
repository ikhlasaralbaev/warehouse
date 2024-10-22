import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  OneToMany,
} from 'typeorm';
import { Balance } from './balance.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => Balance, (balance) => balance.incomes, {
    onDelete: 'CASCADE',
  })
  balance: Balance;

  @ManyToOne(() => Transaction, (transaction) => transaction.incomes, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
