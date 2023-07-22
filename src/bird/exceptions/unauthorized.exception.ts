import { UnauthorizedException as BaseUnauthorizedException } from '@nestjs/common';

export class UnauthorizedException extends BaseUnauthorizedException {
  constructor() {
    super(`You are not authorized to access this resource.`);
  }
}
