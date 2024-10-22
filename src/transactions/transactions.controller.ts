import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Auth()
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user: UserEntity,
  ) {
    return this.transactionsService.createTransaction(
      createTransactionDto,
      user.id,
    );
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.transactionsService.getAllTransactions(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.getTransactionById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
