import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { PresenterInterceptor } from '../interceptors';

export function UsePresenter(presenter: new (...args: any[]) => any) {
  return applyDecorators(UseInterceptors(new PresenterInterceptor(presenter)));
}
