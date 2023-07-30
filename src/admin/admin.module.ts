import { Module } from '@nestjs/common';
import { AdminService } from './services';
import { CoreModule } from '&/core/core.module';
import { AdminController } from './controllers';
import { RepositoriesModule } from '&/infrastructure/repositories/repositories.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [RepositoriesModule, CoreModule],
})
export class AdminModule {}
