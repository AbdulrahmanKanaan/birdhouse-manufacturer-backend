import { Residency } from '../entities';
import {
  EntityNotFoundException,
  EntityValidationException,
  RepositoryException,
} from './exceptions';

export interface ResidencyRepository {
  /**
   * Creates a new residency
   * @param residency Data to create a new residency
   * @returns The created residency
   * @throws {EntityNotFoundException} If the birdhouse does not exist
   * @throws {EntityValidationException} If the residency is invalid
   * @throws {RepositoryException} If the residency could not be created
   */
  create(residency: Omit<Residency, 'id'>): Promise<Residency>;
  /**
   * finds a residency by its parent birdhouse id
   * @param birdhouseId The parent birdhouse id
   * @param options Options to find a residency
   * @returns The found residency array
   */
  findByBirdhouseId(
    birdhouseId: string,
    options?: ResidencyRepoTypes.FindAllOptions,
  ): Promise<Residency[]>;
  /**
   * Counts residencies by their parent birdhouse id
   * @param birdhouseId The parent birdhouse id
   * @returns The number of residencies
   */
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
