export abstract class RepositoryException extends Error {
  public readonly error?: Error;

  constructor(message = 'Repository exception', error?: Error) {
    super(message);
    this.error = error;
  }
}
