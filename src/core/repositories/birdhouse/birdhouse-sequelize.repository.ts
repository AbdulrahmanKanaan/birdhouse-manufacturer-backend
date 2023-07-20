import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  BirdhouseMutationFailedException,
  BirdhouseNotFoundException,
} from '&/core/exceptions';
import { BirdhouseModel } from '&/core/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import {
  BirdhouseRepository,
  BirdhouseRepositoryTypes,
} from '&/domain/repositories';

export class BirdhouseSequelizeRepository implements BirdhouseRepository {
  constructor(
    @InjectModel(BirdhouseModel)
    private readonly birdhouseModel: typeof BirdhouseModel,
    @Inject(BirdhouseMapper)
    private readonly birdhouseMapper: BirdhouseMapper<BirdhouseModel>,
  ) {}

  public async create(data: Birdhouse): Promise<Birdhouse> {
    const birdhouse = this.birdhouseMapper.toModel(data);

    try {
      await birdhouse.save();
    } catch (e) {
      throw new BirdhouseMutationFailedException();
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
      throw new BirdhouseNotFoundException();
    }

    try {
      const newBirdhouse = await birdhouse.update(updatedBirdhouse);
      return this.birdhouseMapper.toEntity(newBirdhouse);
    } catch (e) {
      throw new BirdhouseMutationFailedException();
    }
  }

  public async delete(
    filter: BirdhouseRepositoryTypes.DeleteFilter,
  ): Promise<void> {
    const birdhouse = await this.birdhouseModel.findOne({
      where: { id: filter.id },
    });

    if (!birdhouse) {
      throw new BirdhouseNotFoundException();
    }

    await birdhouse.destroy();
  }

  public async findById(id: string): Promise<Birdhouse> {
    const birdhouse = await this.birdhouseModel.findOne({
      where: { id },
    });

    if (!birdhouse) {
      throw new BirdhouseNotFoundException();
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
        createdAt: {
          [Op.lte]: filters.olderThan,
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
        createdAt: {
          [Op.lte]: filters.olderThan,
        },
      },
    });

    return count;
  }
}
