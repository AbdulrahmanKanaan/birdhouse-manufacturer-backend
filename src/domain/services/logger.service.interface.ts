export interface LoggerService {
  log(message: any, context?: string): void;
  error(message: any, stack?: string, context?: string): void;
  warn(message: any, context?: string): void;
  setContext(context: string): void;
}

export const LoggerService = Symbol('LoggerService');
