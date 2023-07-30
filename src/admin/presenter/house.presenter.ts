import { Birdhouse } from '&/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class HousePresenter {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  longitude!: number;
  @ApiProperty()
  latitude!: number;
  @ApiProperty()
  birds!: number;
  @ApiProperty()
  eggs!: number;

  constructor(house: Birdhouse) {
    this.id = house.id!;
    this.name = house.name;
    this.longitude = house.longitude;
    this.latitude = house.latitude;
    this.birds = house.residency?.birds || 0;
    this.eggs = house.residency?.eggs || 0;
  }
}
