import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService],
  imports: [TypeOrmModule.forFeature([Unit])],
})
export class UnitsModule {}
