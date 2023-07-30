import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { getSequelizeConfig } from './common/config/sequelize.config';
import { CoreModule } from './core/core.module';
import { BirdModule } from './bird/bird.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getSequelizeConfig,
    }),
    CoreModule,
    AdminModule,
    BirdModule,
    LoggerModule,
  ],
})
export class AppModule {}
