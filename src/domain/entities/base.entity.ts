/**
 * Base entity class that all other entities should extend.
 * @template IDType - Type of the entity's id.
 */
export abstract class Entity<IDType = number> {
  id?: IDType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null; // null means that entity is not deleted, Date means that entity is deleted

  protected constructor(
    id?: IDType,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
