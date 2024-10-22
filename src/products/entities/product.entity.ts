import { Expence } from 'src/balances/entities/expences.entity';
import { IncomeProductEntity } from 'src/income_product/entites/income.entity';
import { TransactionProduct } from 'src/transactions/entities/transaction-product.entity';
import { Unit } from 'src/units/entities/unit.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  sellPrice: number;

  @Column({ default: 0 })
  minCount: number;

  @Column({ default: 'green' })
  status: string;

  @ManyToOne(() => Unit, (unit) => unit.products, { onDelete: 'SET NULL' })
  @JoinColumn()
  unit: Unit;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn()
  createdBy: User;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => IncomeProductEntity, (income) => income.product)
  incomeTransactions: IncomeProductEntity[];

  @OneToMany(() => TransactionProduct, (transaction) => transaction.product)
  transactionProducts: TransactionProduct[];

  @OneToMany(() => Expence, (expence) => expence.product)
  expences: Expence[];
}
