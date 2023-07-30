import { Page } from '&/common/types';
import { Birdhouse } from '&/domain/entities';
import { ApiProperty } from '@nestjs/swagger';
import { HousePresenter } from './house.presenter';

export class ListHousesPresenter {
  @ApiProperty({ type: [HousePresenter], description: 'array of birdhouses' })
  data: HousePresenter[];

  @ApiProperty({ description: 'number of all birdhouses in the database' })
  total: number;

  @ApiProperty({ description: 'requested page number' })
  page: number;

  @ApiProperty({ description: 'requested items per page' })
  perPage: number;

  @ApiProperty({ description: 'number of available pages' })
  pageCount: number;

  constructor(page: Page<Birdhouse>) {
    this.data = page.data.map((house) => new HousePresenter(house));
    this.perPage = page.perPage;
    this.page = page.page;
    this.total = page.total;
    this.pageCount = page.pageCount;
  }
}
