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

    // get the token from the headers
    const token = request.headers['x-ubid'] as string;

    // if there is no token, throw an exception
    if (!token) {
      throw new UnauthorizedException();
    }

    // split the token by comma to handle multiple UBIDs (bulk UBIDs)
    const ubids = token.split(',');

    // find all the birdhouses that match the UBIDs
    const birdhouses = await this.birdhouseRepo.findAll({
      ubid: ubids,
    });

    // if the number of birdhouses found is different from the number of UBIDs
    // that means that some UBIDs are invalid
    // throw an exception
    if (ubids.length !== birdhouses.length) {
      throw new UnauthorizedException();
    }

    // get the birdhouses ids
    const housesIds = birdhouses.map((birdhouse) => birdhouse.id);

    // inject the birdhouses ids in the request
    request['housesIds'] = housesIds;

    SetMetadata('housesIds', housesIds);

    return true;
  }
}
