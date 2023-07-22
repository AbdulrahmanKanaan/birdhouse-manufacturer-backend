import { NotFoundException } from '@nestjs/common';

export class BirdhouseNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Birdhouse with id ${id} not found`);
  }
}
