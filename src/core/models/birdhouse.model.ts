import { UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ResidencyModel } from './residency.model';

@Table({
  tableName: 'birdhouses',
  timestamps: true,
  deletedAt: true,
  paranoid: true,
})
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
    type: DataType.DOUBLE,
  })
  longitude!: number;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  latitude!: number;

  @ForeignKey(() => ResidencyModel)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  residencyId!: number | null;

  @HasMany(() => ResidencyModel)
  history?: ResidencyModel[];

  @BelongsTo(() => ResidencyModel, { onDelete: 'SET NULL' })
  residency?: ResidencyModel;
}
