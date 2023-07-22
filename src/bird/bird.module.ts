import { Module } from '@nestjs/common';
import { BirdController } from './controllers';
import { BirdService } from './services';
import { CoreModule } from '&/core/core.module';

@Module({
  controllers: [BirdController],
  providers: [BirdService],
  imports: [CoreModule],
})
export class BirdModule {}
