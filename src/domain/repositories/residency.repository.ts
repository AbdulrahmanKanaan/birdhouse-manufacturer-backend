import { Residency } from '../entities/residency.entity';

export interface ResidencyRepository {
  create(residency: Residency): Promise<Residency>;
  findByBirdhouseId(birdhouseId: string): Promise<Residency[]>;
  countByBirdhouseId(birdhouseId: string): Promise<number>;
}

export const ResidencyRepository = Symbol('ResidencyRepository');
