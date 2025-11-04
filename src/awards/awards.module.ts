import { Module } from '@nestjs/common';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';
import { AwardsRepository } from './awards.repository';
import { MoviesModule } from '../movies/movies.module';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports:[MoviesModule, ProducersModule],
  controllers: [AwardsController],
  providers: [AwardsService, AwardsRepository],
  exports:[AwardsRepository]
})
export class AwardsModule {}
