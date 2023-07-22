import { Residency } from '../entities/residency.entity';

export interface ResidencyRepository {
  create(residency: Omit<Residency, 'id'>): Promise<Residency>;
  findByBirdhouseId(birdhouseId: string): Promise<Residency[]>;
  countByBirdhouseId(birdhouseId: string): Promise<number>;
  getLatestResidency(birdhouseId: string): Promise<Residency | null>;
}

export const ResidencyRepository = Symbol('ResidencyRepository');
