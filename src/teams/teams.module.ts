import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [TypeOrmModule.forFeature([Team])],
})
export class TeamsModule {}
