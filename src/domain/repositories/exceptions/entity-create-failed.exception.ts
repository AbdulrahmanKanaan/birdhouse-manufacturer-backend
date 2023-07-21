import { RepositoryException } from './repository.exception';

interface EntityCreateFailedExceptionParams<EntityType = any> {
  entity?: EntityType;
  message?: string;
  error?: Error;
}

export class EntityCreateFailedException<
  EntityType = any,
> extends RepositoryException {
  public readonly entity?: EntityType;

  constructor({
    entity,
    message = `Couldn't create entity`,
    error,
  }: EntityCreateFailedExceptionParams<EntityType>) {
    super(message, error);
    this.entity = entity;
  }
}
