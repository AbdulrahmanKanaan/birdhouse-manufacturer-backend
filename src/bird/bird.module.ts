import { Module } from '@nestjs/common';
import { BirdController } from './controllers';
import { BirdService } from './services';
import { CoreModule } from '&/core/core.module';
import { LoggerModule } from '&/logger/logger.module';

@Module({
  controllers: [BirdController],
  providers: [BirdService],
  imports: [CoreModule, LoggerModule],
})
export class BirdModule {}
