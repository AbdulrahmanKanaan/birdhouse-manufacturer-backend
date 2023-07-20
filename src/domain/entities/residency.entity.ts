import { Entity } from './base.entity';
import { Birdhouse } from './birdhouse.entity';

export class Residency extends Entity<number> {
  birds: number;
  eggs: number;

  birdhouseId: string;
  birdhouse?: Birdhouse;

  constructor(
    id: number | null,
    birds: number,
    eggs: number,
    birdhouseId: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.birds = birds;
    this.eggs = eggs;
    this.birdhouseId = birdhouseId;
  }
}
