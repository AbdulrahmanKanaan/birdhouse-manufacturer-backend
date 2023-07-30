import { Residency } from '../entities/residency.entity';

export interface ResidencyRepository {
  create(residency: Omit<Residency, 'id'>): Promise<Residency>;
  findByBirdhouseId(
    birdhouseId: string,
    options?: ResidencyRepoTypes.FindAllOptions,
  ): Promise<Residency[]>;
  countByBirdhouseId(birdhouseId: string): Promise<number>;
}

export const ResidencyRepository = Symbol('ResidencyRepository');

export namespace ResidencyRepoTypes {
  export type FindAllOptions = {
    limit?: number;
    skip?: number;
    order?: {
      by: string;
      direction: 'ASC' | 'DESC';
    };
  };
}
