import { UUIDV4 } from 'sequelize';
import {
  Column,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ResidencyModel } from './residency.model';

@Table({ tableName: 'birdhouses', timestamps: true, deletedAt: true })
export class BirdhouseModel extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4,
  })
  id!: string;

  @IsUUID(4)
  @Column({
    defaultValue: UUIDV4,
    allowNull: false,
    unique: true,
  })
  ubid!: string;

  @Column({
    allowNull: false,
  })
  name!: string;

  @Column({
    allowNull: false,
  })
  longitude!: number;

  @Column({
    allowNull: false,
  })
  latitude!: number;

  @HasMany(() => ResidencyModel)
  history?: ResidencyModel[];
}
