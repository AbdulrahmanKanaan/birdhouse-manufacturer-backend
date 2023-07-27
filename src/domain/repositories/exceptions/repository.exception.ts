interface RepositoryExceptionParams {
  message?: string;
  error?: Error;
}

export class RepositoryException extends Error {
  public readonly error?: Error;

  constructor({
    message = 'Repository exception',
    error,
  }: RepositoryExceptionParams = {}) {
    super(message);
    this.error = error;
  }
}
