import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PresenterInterceptor<T, R extends new (...args: any[]) => any>
  implements NestInterceptor<T, InstanceType<R>>
{
  constructor(private readonly Presenter: R) {}

  /**
   * Intercepts the response and wraps it in the presenter
   * @param context
   * @param next
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<InstanceType<R>> {
    return next.handle().pipe(map((data) => new this.Presenter(data)));
  }
}
