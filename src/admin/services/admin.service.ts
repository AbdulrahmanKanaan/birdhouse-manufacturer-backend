import { Page } from '&/common/types';
import { Birdhouse, Residency } from '&/domain/entities';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { BirdhouseNotFoundException } from '../../bird/exceptions';
import { ListHousesDto } from '../dto/list-houses.dto';
import { ListHistoryDto } from '../dto';
import { paramsToPage } from '&/common/utils/pagination';

@Injectable()
export class AdminService {
  constructor(
    @Inject(BirdhouseRepository)
    private readonly birdhouseRepo: BirdhouseRepository,
    @Inject(ResidencyRepository)
    private readonly residencyRepo: ResidencyRepository,
  ) {}

  public async listBirdhouses(
    listHousesDto: ListHousesDto,
  ): Promise<Page<Birdhouse>> {
    const { page, perPage, name } = listHousesDto;

    const count = await this.birdhouseRepo.count({ name });

    const { skip, limit } = paramsToPage(page, perPage);

    const houses = await this.birdhouseRepo.findAll(
      { name },
      {
        skip,
        limit,
        relations: { residency: true },
        order: {
          by: 'createdAt',
          direction: 'ASC',
        },
      },
    );

    return new Page(houses, count, page, perPage);
  }

  public async getHistory(
    birdhouseId: string,
    listHistoryDto: ListHistoryDto,
  ): Promise<Page<Residency>> {
    const { page, perPage } = listHistoryDto;

    const birdhouse = await this.birdhouseRepo.findOne({ id: birdhouseId });

    if (!birdhouse) throw new BirdhouseNotFoundException(birdhouseId);

    const { skip, limit } = paramsToPage(page, perPage);

    const history = await this.residencyRepo.findByBirdhouseId(birdhouseId, {
      skip,
      limit,
    });

    const historyCount = await this.residencyRepo.countByBirdhouseId(
      birdhouseId,
    );

    return new Page(history, historyCount, page, perPage);
  }
}
