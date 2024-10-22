import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  sellPrice: number;

  @IsNumber()
  unit: number;

  @IsNumber()
  minCount: number;
}
