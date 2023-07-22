import { InternalServerErrorException } from '@nestjs/common';

export class BirdhouseCreateFailedException extends InternalServerErrorException {
  constructor() {
    super(`Birdhouse could not be created`);
  }
}
