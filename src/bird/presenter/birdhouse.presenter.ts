import { Birdhouse } from '&/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class BirdhousePresenter {
  @ApiProperty()
  name: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  birds: number;

  @ApiProperty()
  eggs: number;

  constructor(birdhouse: Birdhouse) {
    this.name = birdhouse.name;
    this.longitude = birdhouse.longitude;
    this.latitude = birdhouse.latitude;
    this.birds = birdhouse.residency?.birds || 0;
    this.eggs = birdhouse.residency?.eggs || 0;
  }
}
