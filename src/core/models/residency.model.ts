import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BirdhouseModel } from './birdhouse.model';

@Table({ tableName: 'residencies', timestamps: true })
export class ResidencyModel extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  birds!: number;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  eggs!: number;

  @ForeignKey(() => BirdhouseModel)
  @Column
  birdhouseId!: string;

  @BelongsTo(() => BirdhouseModel)
  birdhouse?: BirdhouseModel;
}
