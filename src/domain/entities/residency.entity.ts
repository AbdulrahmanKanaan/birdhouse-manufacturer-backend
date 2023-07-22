import { Entity } from './base.entity';
import { Birdhouse } from './birdhouse.entity';

export class Residency extends Entity<number> {
  birds: number;
  eggs: number;

  birdhouseId: string;
  birdhouse?: Birdhouse;

  constructor(
    id: number | undefined,
    birdhouseId: string,
    birds: number,
    eggs: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.birds = birds;
    this.eggs = eggs;
    this.birdhouseId = birdhouseId;
  }
}
