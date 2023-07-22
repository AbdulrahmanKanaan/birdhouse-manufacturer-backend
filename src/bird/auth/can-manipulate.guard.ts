import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedException } from '../exceptions';

@Injectable()
export class CanManipulateGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & Record<string, any>>();

    const housesIds = request['housesIds'];

    const id = request.params.id;

    if (!housesIds.includes(id)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
