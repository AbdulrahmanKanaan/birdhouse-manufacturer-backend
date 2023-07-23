import { PaginatedDto } from '&/common/dto';
import { IsOptional, IsString } from 'class-validator';

export class ListHousesDto extends PaginatedDto {
  @IsOptional()
  @IsString()
  name?: string;
}
