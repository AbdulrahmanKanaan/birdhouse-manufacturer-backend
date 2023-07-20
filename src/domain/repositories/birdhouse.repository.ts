import { Birdhouse } from '../entities';

export interface BirdhouseRepository {
  create(data: Birdhouse): Promise<Birdhouse>;
  update(
    filter: BirdhouseRepositoryTypes.UpdateFilter,
    data: Partial<Birdhouse>,
  ): Promise<Birdhouse>;
  delete(filter: BirdhouseRepositoryTypes.DeleteFilter): Promise<void>;
  findById(id: string): Promise<Birdhouse>;
  findAll(
    filters: BirdhouseRepositoryTypes.FindAllFilters,
    options: BirdhouseRepositoryTypes.FindAllOptions,
  ): Promise<Birdhouse[]>;
  count(filters: BirdhouseRepositoryTypes.FindAllFilters): Promise<number>;
}

export const BirdhouseRepository = Symbol('BirdhouseRepository');

export namespace BirdhouseRepositoryTypes {
  export type UpdateFilter = {
    id: string;
  };

  export type DeleteFilter = {
    id: string;
  };

  export type FindAllFilters = {
    olderThan?: Date;
  };

  export type FindAllOptions = {
    limit?: number;
    skip?: number;
    order?: {
      by: string;
      direction: 'ASC' | 'DESC';
    };
  };
}
