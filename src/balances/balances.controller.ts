import { Controller, Get, Post } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  findAll() {
    return this.balancesService.findAll();
  }

  @Get('incomes')
  getIncomes() {
    return this.balancesService.getIncomes();
  }

  @Get('expences')
  getExpences() {
    return this.balancesService.getExpences();
  }

  @Post()
  async create() {
    return this.balancesService.create();
  }
}
