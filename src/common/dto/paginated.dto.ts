import { IsNumber } from 'class-validator';

export class PaginatedDto {
  @IsNumber()
  page = 1;

  @IsNumber()
  perPage = 5;
}
