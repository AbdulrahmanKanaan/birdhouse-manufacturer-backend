import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddResidencyDto {
  @ApiProperty({ description: 'number of birds' })
  @IsNumber()
  public birds!: number;

  @ApiProperty({ description: 'number of eggs' })
  @IsNumber()
  public eggs!: number;
}
