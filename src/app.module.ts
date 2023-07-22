import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { getSequelizeConfig } from './core/config/sequelize.config';
import { CoreModule } from './core/core.module';
import { BirdModule } from './bird/bird.module';

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
  ],
})
export class AppModule {}
