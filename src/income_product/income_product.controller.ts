import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { IncomeProduct } from './dto/income-product-dto';
import { IncomeProductService } from './income_product.service';

@Controller('income-product')
export class IncomeProductController {
  constructor(private readonly incomeProductService: IncomeProductService) {}

  @Auth()
  @Post()
  async income(@Body() body: IncomeProduct, @User() user: UserEntity) {
    return this.incomeProductService.incomeProduct(body, user);
  }

  @Auth()
  @Get()
  async incomes(@Query('page') page: number = 1) {
    return this.incomeProductService.getIncomeProduct(page);
  }
}
