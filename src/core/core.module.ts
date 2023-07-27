import { BirdhouseMapper, ResidencyMapper } from '&/domain/mappers';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import { Module, Provider } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BirdhouseModel, ResidencyModel } from './models';
import {
  BirdhouseSequelizeRepository,
  BirdhouseSequelizeMapper,
} from './repositories/birdhouse';
import {
  ResidencySequelizeRepository,
  ResidencySequelizeMapper,
} from './repositories/residency';
import { HouseService } from './services';
import { BirdhouseCron } from './cronjobs/birdhouse.cron';
import { LoggerModule } from '&/logger/logger.module';

const repositories: Provider[] = [
  {
    provide: BirdhouseRepository,
    useClass: BirdhouseSequelizeRepository,
  },
  {
    provide: ResidencyRepository,
    useClass: ResidencySequelizeRepository,
  },
];

const mappers: Provider[] = [
  { provide: BirdhouseMapper, useClass: BirdhouseSequelizeMapper },
  { provide: ResidencyMapper, useClass: ResidencySequelizeMapper },
];

@Module({
  providers: [...repositories, ...mappers, HouseService, BirdhouseCron],
  imports: [
    SequelizeModule.forFeature([BirdhouseModel, ResidencyModel]),
    LoggerModule,
  ],
  exports: [...repositories, HouseService],
})
export class CoreModule {}
