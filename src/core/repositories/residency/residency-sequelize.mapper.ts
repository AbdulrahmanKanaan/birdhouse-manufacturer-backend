import { ResidencyModel } from '&/core/models';
import { Residency } from '&/domain/entities';
import { ResidencyMapper } from '&/domain/mappers';
import { InjectModel } from '@nestjs/sequelize';

export class ResidencySequelizeMapper
  implements ResidencyMapper<ResidencyModel>
{
  constructor(
    @InjectModel(ResidencyModel)
    private readonly residencyModel: typeof ResidencyModel,
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
    return new Residency(
      model.id,
      model.birdhouseId,
      model.birds,
      model.eggs,
      model.createdAt,
      model.updatedAt,
    );
  }
}
