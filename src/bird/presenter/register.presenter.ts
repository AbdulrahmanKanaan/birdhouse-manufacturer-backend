import { Birdhouse } from '&/domain/entities';
import { BirdhousePresenter } from './birdhouse.presenter';

export class RegisterPresenter extends BirdhousePresenter {
  id: string;

  ubid: string;

  constructor(birdhouse: Birdhouse) {
    super(birdhouse);
    this.id = birdhouse.id!;
    this.ubid = birdhouse.ubid;
  }
}
