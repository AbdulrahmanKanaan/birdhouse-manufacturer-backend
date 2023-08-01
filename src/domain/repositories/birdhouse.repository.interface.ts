import { Birdhouse } from '../entities';
import {
  EntityNotFoundException,
  EntityValidationException,
  RepositoryException,
} from './exceptions';

export interface BirdhouseRepository {
  /**
   * Creates a new birdhouse
   * @param data Data to create a new birdhouse
   * @returns The created birdhouse
   * @throws {EntityValidationException} If the birdhouse is invalid
   * @throws {RepositoryException} If the birdhouse could not be created
   */
  create(data: Omit<Birdhouse, 'id'>): Promise<Birdhouse>;
  /**
   * Updates a birdhouse
   * @param filter Conditions to update a birdhouse
   * @param data Updated data
   * @returns The updated birdhouse
   * @throws {EntityValidationException} If the birdhouse is invalid
   * @throws {EntityNotFoundException} If the birdhouse does not exist
   * @throws {RepositoryException} If the birdhouse could not be updated
   */
  update(
    filter: BirdhouseRepoTypes.UpdateFilter,
    data: Partial<Birdhouse>,
  ): Promise<Birdhouse>;
  /**
   * Deletes a birdhouse
   * @param filter Conditions to delete a birdhouse
   * @returns
   * @throws {RepositoryException} If deleting the birdhouse failed
   */
  delete(filter: BirdhouseRepoTypes.DeleteFilter): Promise<void>;
  /**
   * Finds a birdhouse
   * @param filter Conditions to find a birdhouse
   * @param options Options to find a birdhouse
   * @returns The found birdhouse
   * @returns null if no birdhouse was found
   */
  findOne(
    filter: BirdhouseRepoTypes.FindOneFilter,
    options?: BirdhouseRepoTypes.FindOptions,
  ): Promise<Birdhouse | null>;
  /**
   * Finds all birdhouses
   * @param filters Conditions to find all birdhouses
   * @param options Options to find all birdhouses
   * @returns All found birdhouses
   */
  findAll(
    filters?: BirdhouseRepoTypes.FindAllFilters,
    options?: BirdhouseRepoTypes.FindAllOptions,
  ): Promise<Birdhouse[]>;
  /**
   * Counts all birdhouses
   * @param filters Conditions to count all birdhouses
   * @returns The number of birdhouses
   */
  count(filters?: BirdhouseRepoTypes.FindAllFilters): Promise<number>;
  /**
   * Gets all birdhouses that are outdated
   * @param date Date to check if a birdhouse is outdated
   * @returns All birdhouses that were not updated since the given date
   */
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
