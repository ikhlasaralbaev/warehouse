import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateIncomeDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  balanceId: number;

  @IsNumber()
  @IsNotEmpty()
  transaction: number;
}
