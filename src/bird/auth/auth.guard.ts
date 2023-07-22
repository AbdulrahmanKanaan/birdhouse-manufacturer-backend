import { BirdhouseRepository } from '&/domain/repositories';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedException } from '../exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(BirdhouseRepository)
    private readonly birdhouseRepo: BirdhouseRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & Record<string, any>>();

    const token = request.headers['x-ubid'] as string;

    if (!token) {
      throw new UnauthorizedException();
    }

    const ubids = token.split(',');

    const birdhouses = await this.birdhouseRepo.findAll({
      ubid: ubids,
    });

    if (ubids.length !== birdhouses.length) {
      throw new UnauthorizedException();
    }

    const housesIds = birdhouses.map((birdhouse) => birdhouse.id);

    request['housesIds'] = housesIds;

    SetMetadata('housesIds', housesIds);

    return true;
  }
}
