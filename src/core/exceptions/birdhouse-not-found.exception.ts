import { NotFoundException } from '@nestjs/common';

export class BirdhouseNotFoundException extends NotFoundException {
  constructor() {
    super('Birdhouse not found');
  }
}
