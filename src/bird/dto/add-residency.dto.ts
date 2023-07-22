import { IsNumber } from 'class-validator';

export class AddResidencyDto {
  @IsNumber()
  public birds!: number;

  @IsNumber()
  public eggs!: number;
}
