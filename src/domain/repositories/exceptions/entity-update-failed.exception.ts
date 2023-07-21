import { RepositoryException } from './repository.exception';

interface EntityUpdateFailedExceptionParams<IDType = any> {
  id: IDType;
  message?: string;
  error?: Error;
}

export class EntityUpdateFailedException<
  IDType = any,
> extends RepositoryException {
  public readonly id: IDType;

  constructor({
    id,
    message = `Couldn't update entity with id ${id}`,
    error,
  }: EntityUpdateFailedExceptionParams<IDType>) {
    super(message, error);
    this.id = id;
  }
}
