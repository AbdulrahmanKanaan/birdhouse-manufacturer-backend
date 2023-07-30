import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginatedDto {
  @ApiProperty({
    description: 'page number',
    default: 1,
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @ApiProperty({
    description: 'number of items per one page',
    default: 10,
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  perPage = 10;
}
