import { Birdhouse } from '&/domain/entities';
import { BirdhouseRepository } from '&/domain/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { BirdhouseNotFoundException } from '../../bird/exceptions';

@Injectable()
export class AdminService {
  constructor(
    @Inject(BirdhouseRepository)
    private readonly birdhouseRepo: BirdhouseRepository,
  ) {}

  public async listBirdhouses(): Promise<Birdhouse[]> {
    console.log(await this.birdhouseRepo.count({ name: 'Bird' }));
    return this.birdhouseRepo.findAll({ name: 'Shit' }, {});
  }

  public async getBirdhouse(id: string): Promise<Birdhouse> {
    const birdhouse = await this.birdhouseRepo.findOne({ id });

    if (!birdhouse) {
      throw new BirdhouseNotFoundException(id);
    }

    return birdhouse;
  }
}
