import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { PresenterInterceptor } from '../interceptors';

/**
 * @param presenter presenter class to map the data from the controller
 * @returns view model mapped from the controller
 */
export function UsePresenter(presenter: new (...args: any[]) => any) {
  return applyDecorators(UseInterceptors(new PresenterInterceptor(presenter)));
}
