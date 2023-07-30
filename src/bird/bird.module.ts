import { Module } from '@nestjs/common';
import { BirdController } from './controllers';
import { BirdService } from './services';
import { CoreModule } from '&/core/core.module';
import { LoggerModule } from '&/infrastructure/logger/logger.module';
import { RepositoriesModule } from '&/infrastructure/repositories/repositories.module';

@Module({
  controllers: [BirdController],
  providers: [BirdService],
  imports: [RepositoriesModule, CoreModule, LoggerModule],
})
export class BirdModule {}
