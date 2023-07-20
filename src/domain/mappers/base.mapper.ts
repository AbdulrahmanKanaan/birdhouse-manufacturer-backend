export interface Mapper<Entity, Model> {
  toModel(entity: Entity): Model;
  toEntity(model: Model): Entity;
}
