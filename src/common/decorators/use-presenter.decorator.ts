import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { PresenterInterceptor } from '../interceptors';
import { ApiResponse } from '@nestjs/swagger';

/**
 * @param presenter presenter class to map the data from the controller
 * @returns view model mapped from the controller + adding swagger api
 */
export function UsePresenter(presenter: new (...args: any[]) => any) {
  return applyDecorators(
    UseInterceptors(new PresenterInterceptor(presenter)),
    ApiResponse({ type: presenter }),
  );
}
