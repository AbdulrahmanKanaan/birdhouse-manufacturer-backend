import { BirdhouseModel, ResidencyModel } from '&/core/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper, ResidencyMapper } from '&/domain/mappers';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

export class BirdhouseSequelizeMapper
  implements BirdhouseMapper<BirdhouseModel>
{
  constructor(
    @InjectModel(BirdhouseModel)
    private readonly birdhouseModel: typeof BirdhouseModel,
    @Inject(forwardRef(() => ResidencyMapper))
    private readonly residencyMapper: ResidencyMapper<ResidencyModel>,
  ) {}

  toModel(entity: Partial<Birdhouse>): BirdhouseModel {
    return this.birdhouseModel.build({
      id: entity.id,
      ubid: entity.ubid,
      name: entity.name,
      latitude: entity.latitude,
      longitude: entity.longitude,
      residencyId: entity.residencyId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  toEntity(model: BirdhouseModel): Birdhouse {
    const birdhouse = new Birdhouse(
      model.id,
      model.ubid,
      model.name,
      model.longitude,
      model.latitude,
      model.residencyId,
      model.createdAt,
      model.updatedAt,
      model.deletedAt,
    );
    birdhouse.residency =
      model.residency && this.residencyMapper.toEntity(model.residency);
    birdhouse.history =
      model.history && model.history.map(this.residencyMapper.toEntity);
    return birdhouse;
  }
}
