import { InternalServerErrorException } from '@nestjs/common';

export class BirdhouseMutationFailedException extends InternalServerErrorException {
  constructor() {
    super('Birdhouse mutation failed');
  }
}
