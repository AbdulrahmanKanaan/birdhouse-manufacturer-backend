import { LoggerService as BaseLoggerService } from '&/domain/services';
import {
  ConsoleLogger,
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService
  extends ConsoleLogger
  implements BaseLoggerService, NestLoggerService
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly winstonLogger: NestLoggerService,
  ) {
    super();
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.winstonLogger.log(message, context || this.context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.winstonLogger.error(message, stack, context || this.context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.winstonLogger.warn(message, context || this.context);
  }
}
