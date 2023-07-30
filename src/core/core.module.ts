import { RepositoriesModule } from '&/infrastructure/repositories/repositories.module';
import { LoggerModule } from '&/infrastructure/logger/logger.module';
import { Module } from '@nestjs/common';
import { BirdhouseCron } from './cronjobs/birdhouse.cron';
import { HouseService } from './services';

@Module({
  providers: [HouseService, BirdhouseCron],
  imports: [RepositoriesModule, LoggerModule],
  exports: [HouseService],
})
export class CoreModule {}
