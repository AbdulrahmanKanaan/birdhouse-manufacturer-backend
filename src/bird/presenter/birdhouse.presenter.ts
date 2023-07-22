import { Birdhouse } from '&/domain/entities';

export class BirdhousePresenter {
  name: string;

  longitude: number;

  latitude: number;

  birds: number;

  eggs: number;

  constructor(birdhouse: Birdhouse) {
    this.name = birdhouse.name;
    this.longitude = birdhouse.longitude;
    this.latitude = birdhouse.latitude;
    this.birds = birdhouse.residency?.birds || 0;
    this.eggs = birdhouse.residency?.eggs || 0;
  }
}
