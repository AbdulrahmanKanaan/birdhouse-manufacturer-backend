import { ResidencyModel } from '&/infrastructure/repositories/models';
import { Residency } from '&/domain/entities';
import { ResidencyMapper } from '&/domain/mappers';
import { ResidencyRepoTypes, ResidencyRepository } from '&/domain/repositories';
import {
  EntityValidationException,
  RepositoryException,
} from '&/domain/repositories/exceptions';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError } from 'sequelize';

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
      if (e instanceof ValidationError) {
        throw new EntityValidationException({
          error: e as Error,
          entity: residency,
        });
      }
      throw new RepositoryException({ error: e as Error });
    }

    return this.mapper.toEntity(model);
  }

  public async findByBirdhouseId(
    birdhouseId: string,
    options?: ResidencyRepoTypes.FindAllOptions,
  ): Promise<Residency[]> {
    const residencies = await this.residencyModel.findAll({
      where: { birdhouseId },
      limit: options?.limit,
      offset: options?.skip,
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
