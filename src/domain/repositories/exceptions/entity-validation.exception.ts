import { RepositoryException } from './repository.exception';

interface EntityValidationExceptionParams<EntityType = any> {
  entity: EntityType;
  message?: string;
  error?: Error;
}

export class EntityValidationException<
  EntityType = any,
> extends RepositoryException {
  public readonly entity: EntityType;

  constructor({
    entity,
    message = `Error while validating entity`,
    error,
  }: EntityValidationExceptionParams<EntityType>) {
    super({ message, error });
    this.entity = entity;
  }
}
