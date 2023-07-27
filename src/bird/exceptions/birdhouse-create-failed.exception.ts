import { InternalServerErrorException } from '@nestjs/common';

export class BirdhouseCreateFailedException extends InternalServerErrorException {
  constructor(message?: string) {
    super(message || `Birdhouse could not be created`);
  }
}
