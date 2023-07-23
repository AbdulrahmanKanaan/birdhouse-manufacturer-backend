import { BirdhouseNotFoundException } from '&/bird/exceptions';
import { Birdhouse } from '&/domain/entities';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class HouseService {
  constructor(
    @Inject(BirdhouseRepository)
    private readonly birdhouseRepo: BirdhouseRepository,
    @Inject(ResidencyRepository)
    private readonly residencyRepo: ResidencyRepository,
  ) {}

  public async getBirdhouse(id: string): Promise<Birdhouse> | never {
    const birdhouse = await this.birdhouseRepo.findOne(
      { id },
      { relations: { residency: true } },
    );

    if (!birdhouse) throw new BirdhouseNotFoundException(id);

    return birdhouse;
  }
}
