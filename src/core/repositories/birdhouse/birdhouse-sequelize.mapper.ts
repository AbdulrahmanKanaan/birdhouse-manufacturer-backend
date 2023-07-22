import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import { BirdhouseModel } from '&/core/models';
import { InjectModel } from '@nestjs/sequelize';

export class BirdhouseSequelizeMapper
  implements BirdhouseMapper<BirdhouseModel>
{
  constructor(
    @InjectModel(BirdhouseModel)
    private readonly birdhouseModel: typeof BirdhouseModel,
  ) {}

  toModel(entity: Partial<Birdhouse>): BirdhouseModel {
    return this.birdhouseModel.build({
      id: entity.id,
      ubid: entity.ubid,
      name: entity.name,
      latitude: entity.latitude,
      longitude: entity.longitude,
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
      model.latitude,
      model.longitude,
      model.createdAt,
      model.updatedAt,
      model.deletedAt,
    );
    // birdhouse.residency = model.residency;
    return birdhouse;
  }
}
