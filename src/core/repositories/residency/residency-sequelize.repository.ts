import { ResidencyModel } from '&/core/models';
import { Residency } from '&/domain/entities';
import { ResidencyMapper } from '&/domain/mappers';
import { ResidencyRepository } from '&/domain/repositories';
import { EntityCreateFailedException } from '&/domain/repositories/exceptions';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

export class ResidencySequelizeRepository implements ResidencyRepository {
  constructor(
    @InjectModel(ResidencyModel)
    private readonly residencyModel: typeof ResidencyModel,
    @Inject(ResidencyMapper)
    private readonly mapper: ResidencyMapper<ResidencyModel>,
  ) {}

  public async create(residency: Omit<Residency, 'id'>): Promise<Residency> {
    const model = this.mapper.toModel(residency);

    try {
      await model.save();
    } catch (e) {
      throw new EntityCreateFailedException({ error: e as Error });
    }

    return this.mapper.toEntity(model);
  }

  public async findByBirdhouseId(birdhouseId: string): Promise<Residency[]> {
    const residencies = await this.residencyModel.findAll({
      where: { birdhouseId },
    });

    return residencies.map((residency) => this.mapper.toEntity(residency));
  }

  public async countByBirdhouseId(birdhouseId: string): Promise<number> {
    const count = await this.residencyModel.count({
      where: { birdhouseId },
    });

    return count;
  }
}
