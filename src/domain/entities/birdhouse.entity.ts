import { Entity } from './base.entity';
import { Residency } from './residency.entity';

export class Birdhouse extends Entity<string> {
  ubid: string;
  name: string;
  longitude: number;
  latitude: number;

  residencyId!: number | null;
  residency?: Residency;

  history?: Residency[];

  constructor(
    id: string | undefined,
    ubid: string,
    name: string,
    longitude: number,
    latitude: number,
    residencyId: number | null,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
    this.ubid = ubid;
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.residencyId = residencyId;
  }
}
