import { BirdhouseModel } from '&/core/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import {
  BirdhouseRepository,
  BirdhouseRepositoryTypes,
} from '&/domain/repositories';
import {
  EntityCreateFailedException,
  EntityDeleteFailedException,
  EntityNotFoundException,
  EntityUpdateFailedException,
} from '&/domain/repositories/exceptions';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

export class BirdhouseSequelizeRepository implements BirdhouseRepository {
  constructor(
    @InjectModel(BirdhouseModel)
    private readonly birdhouseModel: typeof BirdhouseModel,
    @Inject(BirdhouseMapper)
    private readonly birdhouseMapper: BirdhouseMapper<BirdhouseModel>,
  ) {}

  public async findById(id: string): Promise<Birdhouse | null> {
    const birdhouse = await this.birdhouseModel.findOne({
      where: { id },
    });

    if (!birdhouse) {
      return null;
    }

    return this.birdhouseMapper.toEntity(birdhouse);
  }

  public async findAll(
    filters: BirdhouseRepositoryTypes.FindAllFilters,
    options: BirdhouseRepositoryTypes.FindAllOptions,
  ): Promise<Birdhouse[]> {
    let order = undefined;
    if (options.order) {
      order = [options.order.by, options.order.direction];
    }

    const birdhouses = await this.birdhouseModel.findAll({
      where: {
        name: {
          [Op.substring]: filters.name,
        },
      },
      limit: options.limit,
      offset: options.skip,
      order,
    });

    return birdhouses.map((birdhouse) =>
      this.birdhouseMapper.toEntity(birdhouse),
    );
  }

  public async count(
    filters: BirdhouseRepositoryTypes.FindAllFilters,
  ): Promise<number> {
    const count = await this.birdhouseModel.count({
      where: {
        name: {
          [Op.substring]: filters.name,
        },
      },
    });

    return count;
  }

  public async create(data: Omit<Birdhouse, 'id'>): Promise<Birdhouse> {
    const birdhouse = this.birdhouseMapper.toModel(data as Birdhouse);

    try {
      await birdhouse.save();
    } catch (e) {
      throw new EntityCreateFailedException({
        entity: data,
        error: e as Error,
      });
    }

    return this.birdhouseMapper.toEntity(birdhouse);
  }

  public async update(
    filters: BirdhouseRepositoryTypes.UpdateFilter,
    updatedBirdhouse: Partial<Birdhouse>,
  ): Promise<Birdhouse> {
    const birdhouse = await this.birdhouseModel.findOne({
      where: { id: filters.id },
    });

    if (!birdhouse) {
      throw new EntityNotFoundException({ id: filters.id });
    }

    try {
      const newBirdhouse = await birdhouse.update(updatedBirdhouse);
      return this.birdhouseMapper.toEntity(newBirdhouse);
    } catch (e) {
      throw new EntityUpdateFailedException({
        id: filters.id,
        error: e as Error,
      });
    }
  }

  public async delete(
    filter: BirdhouseRepositoryTypes.DeleteFilter,
  ): Promise<void> {
    const birdhouse = await this.birdhouseModel.findOne({
      where: { id: filter.id },
    });

    if (!birdhouse) {
      throw new EntityNotFoundException({ id: filter.id });
    }

    try {
      await birdhouse.destroy();
    } catch (e) {
      throw new EntityDeleteFailedException({
        id: filter.id,
        error: e as Error,
      });
    }
  }
}
