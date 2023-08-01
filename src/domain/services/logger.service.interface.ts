export interface LoggerService {
  /**
   * Logs a message with level 'info'
   * @param message The message to log
   * @param context The context of the message
   * @returns
   */
  log(message: any, context?: string): void;
  /**
   * Logs a message with the level 'error'
   * @param message The message to log
   * @param stack The stacktrace of the error
   * @param context The context of the message
   * @returns
   */
  error(message: any, stack?: string, context?: string): void;
  /**
   * Logs a message with the level 'warn'
   * @param message The message to log
   * @param context The context of the message
   * @returns
   */
  warn(message: any, context?: string): void;
  /**
   * Sets the context of the logger, contexts helps with organizing logs
   * @param context The context to set
   * @returns
   */
  setContext(context: string): void;
}

export const LoggerService = Symbol('LoggerService');
