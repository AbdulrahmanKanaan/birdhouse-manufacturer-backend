import { RepositoryException } from './repository.exception';

interface EntityNotFoundExceptionParams<IDType = any> {
  id: IDType;
  message?: string;
  error?: Error;
}

export class EntityNotFoundException<IDType = any> extends RepositoryException {
  public readonly id: IDType;

  constructor({
    id,
    message = `Entity with id ${id} not found`,
    error,
  }: EntityNotFoundExceptionParams<IDType>) {
    super(message, error);
    this.id = id;
  }
}
