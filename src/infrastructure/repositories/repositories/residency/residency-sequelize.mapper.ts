import {
  BirdhouseModel,
  ResidencyModel,
} from '&/infrastructure/repositories/models';
import { Residency } from '&/domain/entities';
import { BirdhouseMapper, ResidencyMapper } from '&/domain/mappers';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

export class ResidencySequelizeMapper
  implements ResidencyMapper<ResidencyModel>
{
  constructor(
    @InjectModel(ResidencyModel)
    private readonly residencyModel: typeof ResidencyModel,
    @Inject(forwardRef(() => BirdhouseMapper))
    private readonly birdhouseMapper: BirdhouseMapper<BirdhouseModel>,
  ) {}

  toModel(entity: Partial<Residency>): ResidencyModel {
    return this.residencyModel.build({
      id: entity.id,
      birdhouseId: entity.birdhouseId,
      birds: entity.birds,
      eggs: entity.eggs,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toEntity(model: ResidencyModel): Residency {
    const residency = new Residency(
      model.id,
      model.birdhouseId,
      model.birds,
      model.eggs,
      model.createdAt,
      model.updatedAt,
    );
    residency.birdhouse =
      model.birdhouse && this.birdhouseMapper.toEntity(model.birdhouse);
    return residency;
  }
}
