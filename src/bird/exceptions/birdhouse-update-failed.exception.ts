import { InternalServerErrorException } from '@nestjs/common';

export class BirdhouseUpdateFailedException extends InternalServerErrorException {
  constructor(id: string) {
    super(`Birdhouse with id ${id} could not be updated`);
  }
}
