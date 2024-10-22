import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Transaction,
} from 'typeorm';
import { Income } from './incomes.entity';
import { Expence } from './expences.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: 0 })
  warehouseBalance: number;

  @OneToMany(() => Income, (income) => income.balance)
  incomes: Income[];

  @OneToMany(() => Expence, (expence) => expence.balance)
  expenses: Expence[];
}
