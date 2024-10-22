import { IsNumber } from 'class-validator';

export class IncomeProduct {
  @IsNumber()
  quantity: number;

  @IsNumber()
  product: number;

  @IsNumber()
  totalPrice: number;
}
