import { Product } from 'src/products/entities/product.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionProduct } from './transaction-product.entity';
import { Income } from 'src/balances/entities/incomes.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.transactions)
  createdBy: User;

  @ManyToOne(() => Team, (team) => team.transactions, { onDelete: 'CASCADE' })
  team: Team;

  @OneToMany(() => TransactionProduct, (product) => product.transaction)
  transactionProducts: TransactionProduct[];

  @OneToMany(() => Income, (income) => income.transaction)
  incomes: Income[];

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
