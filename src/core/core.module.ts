import { Module, Provider } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BirdhouseModel, ResidencyModel } from './models';
import { BirdhouseRepository } from '&/domain/repositories';
import { BirdhouseSequelizeRepository } from './repositories/birdhouse';
import { BirdhouseMapper } from '&/domain/mappers';
import { BirdhouseSequelizeMapper } from './repositories/birdhouse/birdhouse-sequelize.mapper';

const repositories: Provider[] = [
  {
    provide: BirdhouseRepository,
    useClass: BirdhouseSequelizeRepository,
  },
];

const mappers: Provider[] = [
  { provide: BirdhouseMapper, useClass: BirdhouseSequelizeMapper },
];

@Module({
  providers: [...repositories, ...mappers],
  imports: [SequelizeModule.forFeature([BirdhouseModel, ResidencyModel])],
})
export class CoreModule {}
