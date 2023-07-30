import { Birdhouse } from '../entities';

export interface BirdhouseRepository {
  create(data: Omit<Birdhouse, 'id'>): Promise<Birdhouse>;
  update(
    filter: BirdhouseRepoTypes.UpdateFilter,
    data: Partial<Birdhouse>,
  ): Promise<Birdhouse>;
  delete(filter: BirdhouseRepoTypes.DeleteFilter): Promise<void>;
  findOne(
    filter: BirdhouseRepoTypes.FindOneFilter,
    options?: BirdhouseRepoTypes.FindOptions,
  ): Promise<Birdhouse | null>;
  findAll(
    filters?: BirdhouseRepoTypes.FindAllFilters,
    options?: BirdhouseRepoTypes.FindAllOptions,
  ): Promise<Birdhouse[]>;
  count(filters?: BirdhouseRepoTypes.FindAllFilters): Promise<number>;
  getOutdatedBirdhouses(date: Date): Promise<Birdhouse[]>;
}

export const BirdhouseRepository = Symbol('BirdhouseRepository');

export namespace BirdhouseRepoTypes {
  export type FindOneFilter = {
    id: string;
  };

  export type FindOptions = {
    relations?: {
      residency?: boolean;
    };
  };

  export type UpdateFilter = FindOneFilter;

  export type DeleteFilter = {
    id: string | string[];
  };

  export type FindAllFilters = {
    id?: string[];
    name?: string;
    ubid?: string[];
  };

  export type FindAllOptions = {
    limit?: number;
    skip?: number;
    order?: {
      by: string;
      direction: 'ASC' | 'DESC';
    };
  } & FindOptions;
}
