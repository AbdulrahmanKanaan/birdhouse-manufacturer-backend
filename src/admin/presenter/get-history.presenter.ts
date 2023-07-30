import { Page } from '&/common/types';
import { Residency } from '&/domain/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ResidencyPresenter } from './residency.presenter';

export class GetHistoryPresenter {
  @ApiProperty({
    type: [ResidencyPresenter],
    description: 'array of residencies',
  })
  data: ResidencyPresenter[];

  @ApiProperty({ description: 'number of all residencies in the database' })
  total: number;

  @ApiProperty({ description: 'requested page number' })
  page: number;

  @ApiProperty({ description: 'requested items per page' })
  perPage: number;

  @ApiProperty({ description: 'number of available pages' })
  pageCount: number;

  constructor(page: Page<Residency>) {
    this.data = page.data.map((residency) => new ResidencyPresenter(residency));
    this.perPage = page.perPage;
    this.page = page.page;
    this.total = page.total;
    this.pageCount = page.pageCount;
  }
}
