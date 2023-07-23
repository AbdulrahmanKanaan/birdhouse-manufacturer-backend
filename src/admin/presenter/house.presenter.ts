import { Birdhouse } from '&/domain/entities';

export class HousePresenter {
  id!: string;
  name!: string;
  longitude!: number;
  latitude!: number;
  birds!: number;
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
