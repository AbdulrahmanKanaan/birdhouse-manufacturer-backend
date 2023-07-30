import { PaginatedDto } from '&/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListHousesDto extends PaginatedDto {
  @ApiProperty({ description: 'filter by name', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
