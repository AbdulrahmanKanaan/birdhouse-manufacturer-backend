import { BirdhouseModel, ResidencyModel } from '&/core/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import { BirdhouseRepoTypes, BirdhouseRepository } from '&/domain/repositories';
import {
  EntityCreateFailedException,
  EntityDeleteFailedException,
  EntityNotFoundException,
  EntityUpdateFailedException,
} from '&/domain/repositories/exceptions';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, WhereOptions } from 'sequelize';

export class BirdhouseSequelizeRepository implements BirdhouseRepository {
  constructor(
    @InjectModel(BirdhouseModel)
    private readonly birdhouseModel: typeof BirdhouseModel,
    @Inject(BirdhouseMapper)
    private readonly mapper: BirdhouseMapper<BirdhouseModel>,
    @InjectModel(ResidencyModel)
    private readonly residencyModel: typeof ResidencyModel,
  ) {}

  public async findOne(
    filters: BirdhouseRepoTypes.FindOneFilter,
    options?: BirdhouseRepoTypes.FindOptions,
  ): Promise<Birdhouse | null> {
    const { id } = filters;

    const includes = this.mapRelations(options?.relations);

    const birdhouse = await this.birdhouseModel.findOne({
      where: { id },
      include: includes,
    });

    if (!birdhouse) {
      return null;
    }

    return this.mapper.toEntity(birdhouse);
  }

  public async findAll(
    filters?: BirdhouseRepoTypes.FindAllFilters,
    options?: BirdhouseRepoTypes.FindAllOptions,
  ): Promise<Birdhouse[]> {
    let order = undefined;
    if (options?.order) {
      order = [options.order.by, options.order.direction];
    }

    const where = filters && this.mapWhereFilters(filters);

    const includes = this.mapRelations(options?.relations);

    const birdhouses = await this.birdhouseModel.findAll({
      where,
      limit: options?.limit,
      offset: options?.skip,
      order,
      include: includes,
    });

    return birdhouses.map((birdhouse) => this.mapper.toEntity(birdhouse));
  }

  public async count(
    filters?: BirdhouseRepoTypes.FindAllFilters,
  ): Promise<number> {
    const where = filters && this.mapWhereFilters(filters);

    const count = await this.birdhouseModel.count({
      where,
    });

    return count;
  }

  private mapWhereFilters(filters?: BirdhouseRepoTypes.FindAllFilters) {
    const where: WhereOptions<BirdhouseModel> = {};

    if (filters?.id) {
      where.id = {
        [Op.in]: filters.id,
      };
    }

    if (filters?.name) {
      where.name = {
        [Op.substring]: filters.name,
      };
    }

    if (filters?.ubid) {
      where.ubid = {
        [Op.in]: filters.ubid,
      };
    }

    return where;
  }

  private mapRelations(
    relations: BirdhouseRepoTypes.FindOptions['relations'] = {},
  ) {
    const includes: Includeable[] = [];

    if (relations.residency) {
      includes.push({
        model: this.residencyModel,
        as: 'residency',
      });
    }

    return includes;
  }

  public async create(data: Omit<Birdhouse, 'id'>): Promise<Birdhouse> {
    const birdhouse = this.mapper.toModel(data as Birdhouse);

    try {
      await birdhouse.save();
    } catch (e) {
      throw new EntityCreateFailedException({
        entity: data,
        error: e as Error,
      });
    }

    return this.mapper.toEntity(birdhouse);
  }

  public async update(
    filters: BirdhouseRepoTypes.UpdateFilter,
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
      return this.mapper.toEntity(newBirdhouse);
    } catch (e) {
      throw new EntityUpdateFailedException({
        id: filters.id,
        error: e as Error,
      });
    }
  }

  public async delete(filter: BirdhouseRepoTypes.DeleteFilter): Promise<void> {
    const { id } = filter;

    const ids: string[] = [];

    if (typeof id === 'string') {
      ids.push(id);
    } else {
      ids.push(...id);
    }

    try {
      await this.birdhouseModel.destroy({
        where: { id: { [Op.in]: ids } },
      });
    } catch (e) {
      throw new EntityDeleteFailedException({
        id: filter.id,
        error: e as Error,
      });
    }
  }

  public async getOutdatedBirdhouses(date: Date): Promise<Birdhouse[]> {
    const birdhouses = await this.birdhouseModel.findAll({
      where: {
        updatedAt: {
          [Op.lt]: date,
        },
      },
      include: [
        {
          model: this.residencyModel,
          as: 'residency',
          where: {
            createdAt: {
              [Op.lt]: date,
            },
          },
        },
      ],
    });

    return birdhouses.map((birdhouse) => this.mapper.toEntity(birdhouse));
  }
}
