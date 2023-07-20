export abstract class Entity<IDType = any> {
  id: IDType | null; // null means that id doesn't exist yet (e.g. when creating a new entity)
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null; // null means that entity is not deleted, Date means that entity is deleted

  protected constructor(
    id: IDType | null,
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
