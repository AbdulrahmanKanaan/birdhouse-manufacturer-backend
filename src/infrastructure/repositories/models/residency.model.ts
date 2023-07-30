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

@Table({
  tableName: 'residencies',
  timestamps: true,
})
export class ResidencyModel extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  birds!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  eggs!: number;

  @ForeignKey(() => BirdhouseModel)
  @Column({ allowNull: false })
  birdhouseId!: string;

  @BelongsTo(() => BirdhouseModel)
  birdhouse?: BirdhouseModel;
}
