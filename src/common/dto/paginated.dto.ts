import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginatedDto {
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsNumber()
  @Type(() => Number)
  perPage = 5;
}
