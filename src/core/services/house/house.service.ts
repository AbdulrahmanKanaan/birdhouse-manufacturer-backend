import {
  BirdhouseDeleteFailedException,
  BirdhouseNotFoundException,
} from '&/bird/exceptions';
import { Birdhouse } from '&/domain/entities';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import { RepositoryException } from '&/domain/repositories/exceptions';
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

  public async destroyOutdatedBirdhouses(): Promise<void> {
    // get last year date
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);

    const outdatedBirdhouses = await this.birdhouseRepo.getOutdatedBirdhouses(
      date,
    );

    try {
      await this.birdhouseRepo.delete({
        id: outdatedBirdhouses.map((b) => b.id!),
      });
    } catch (e) {
      if (e instanceof RepositoryException) {
        throw new BirdhouseDeleteFailedException(e.message);
      }
    }
  }
}
