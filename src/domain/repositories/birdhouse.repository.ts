import { Birdhouse } from '../entities';

export interface BirdhouseRepository {
  create(birdhouse: Birdhouse): Promise<Birdhouse>;
  update(birdhouse: Birdhouse): Promise<Birdhouse>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Birdhouse | null>;
  findAll(): Promise<Birdhouse[]>;
  count(): Promise<number>;
}

export const BirdhouseRepository = Symbol('BirdhouseRepository');
