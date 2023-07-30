import { Residency } from '&/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class ResidencyPresenter {
  @ApiProperty()
  birds!: number;
  @ApiProperty()
  eggs!: number;
  @ApiProperty({ description: 'date of residency insertion' })
  date!: string;

  constructor(residency: Residency) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    this.birds = residency.birds;
    this.eggs = residency.eggs;
    this.date = formatter.format(residency.createdAt);
  }
}
