import { Module } from '@nestjs/common';
import { AdminService } from './services';
import { CoreModule } from '&/core/core.module';
import { AdminController } from './controllers';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [CoreModule],
})
export class AdminModule {}
