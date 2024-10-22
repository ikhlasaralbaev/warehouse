import { Role } from './../../roles/entities/role.entity';
import { IncomeProductEntity } from 'src/income_product/entites/income.entity';
import { Product } from 'src/products/entities/product.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'admin' })
  role: string;

  // roles
  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Product, (product) => product.createdBy)
  products: Product[];

  @OneToMany(() => Product, (product) => product.createdBy)
  income_transactions: IncomeProductEntity[];

  @OneToMany(() => Transaction, (transaction) => transaction.createdBy)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
