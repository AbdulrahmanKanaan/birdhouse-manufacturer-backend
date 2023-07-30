import { Module, Provider } from '@nestjs/common';

import { BirdhouseModel, ResidencyModel } from './models';
import {
  BirdhouseSequelizeRepository,
  BirdhouseSequelizeMapper,
} from './repositories/birdhouse';
import {
  ResidencySequelizeRepository,
  ResidencySequelizeMapper,
} from './repositories/residency';
import { BirdhouseMapper, ResidencyMapper } from '&/domain/mappers';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import { SequelizeModule } from '@nestjs/sequelize';

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
  providers: [...repositories, ...mappers],
  imports: [SequelizeModule.forFeature([BirdhouseModel, ResidencyModel])],
  exports: [...repositories],
})
export class RepositoriesModule {}
