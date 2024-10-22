import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class ProductQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateTransactionDto {
  @IsNumber()
  team: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDto)
  @ArrayMinSize(1)
  products: ProductQuantityDto[];

  @IsNumber()
  totalAmount: number;
}
