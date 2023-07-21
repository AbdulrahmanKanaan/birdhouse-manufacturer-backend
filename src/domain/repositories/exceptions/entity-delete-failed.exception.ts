import { RepositoryException } from './repository.exception';

interface EntityDeleteFailedExceptionParams<IDType = any> {
  id: IDType;
  message?: string;
  error?: Error;
}

export class EntityDeleteFailedException<
  IDType = any,
> extends RepositoryException {
  public readonly id: IDType;

  constructor({
    id,
    message = `Couldn't delete entity with id ${id}`,
    error,
  }: EntityDeleteFailedExceptionParams<IDType>) {
    super(message, error);
    this.id = id;
  }
}
