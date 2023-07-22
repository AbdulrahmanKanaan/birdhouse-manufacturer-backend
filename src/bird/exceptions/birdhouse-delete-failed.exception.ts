import { InternalServerErrorException } from '@nestjs/common';

export class BirdhouseDeleteFailedException extends InternalServerErrorException {
  constructor(id: string) {
    super(`Birdhouse with id ${id} could not be deleted`);
  }
}
