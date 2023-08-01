import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedException } from '../exceptions';

@Injectable()
export class CanManipulateGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & Record<string, any>>();

    // get the injected birdhouses ids from the request
    const housesIds = request['housesIds'];

    // get the birdhouse id from the request params
    const id = request.params.id;

    // if the birdhouse id is not in the birdhouses ids
    // that means that the birdhouse does not belong to the user
    // throw an exception
    if (!housesIds.includes(id)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
