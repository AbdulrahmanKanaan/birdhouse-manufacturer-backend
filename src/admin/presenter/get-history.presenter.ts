import { Page } from '&/common/types';
import { Residency } from '&/domain/entities';

export class GetHistoryPresenter {
  data: Partial<{
    birds: number;
    eggs: number;
    date: string;
  }>[];

  total: number;

  page: number;

  perPage: number;

  pageCount: number;

  constructor(page: Page<Residency>) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    this.data = page.data.map((residency) => ({
      birds: residency.birds,
      eggs: residency.eggs,
      date: formatter.format(residency.createdAt),
    }));
    this.perPage = page.perPage;
    this.page = page.page;
    this.total = page.total;
    this.pageCount = page.pageCount;
  }
}
