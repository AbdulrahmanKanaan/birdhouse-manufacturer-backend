import { Birdhouse } from '&/domain/entities';
import { ApiProperty } from '@nestjs/swagger';
import { BirdhousePresenter } from './birdhouse.presenter';

export class RegisterPresenter extends BirdhousePresenter {
  @ApiProperty({ description: 'birdhouse id' })
  id: string;

  @ApiProperty({
    description:
      'birdhouse token or known as registration number, should be sent in BIRD apis header',
  })
  ubid: string;

  constructor(birdhouse: Birdhouse) {
    super(birdhouse);
    this.id = birdhouse.id!;
    this.ubid = birdhouse.ubid;
  }
}
