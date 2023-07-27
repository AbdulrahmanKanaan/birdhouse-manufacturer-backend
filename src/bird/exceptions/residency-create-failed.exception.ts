import { InternalServerErrorException } from '@nestjs/common';

export class ResidencyCreateFailedException extends InternalServerErrorException {
  constructor(message?: string) {
    super(message || `Residency could not be created`);
  }
}
