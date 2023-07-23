import { Page } from '&/common/types';
import { Birdhouse } from '&/domain/entities';
import { HousePresenter } from './house.presenter';

export class ListHousesPresenter {
  data: Partial<Birdhouse>[];

  total: number;

  page: number;

  perPage: number;

  pageCount: number;

  constructor(page: Page<Birdhouse>) {
    this.data = page.data.map((house) => new HousePresenter(house));
    this.perPage = page.perPage;
    this.page = page.page;
    this.total = page.total;
    this.pageCount = page.pageCount;
  }
}
