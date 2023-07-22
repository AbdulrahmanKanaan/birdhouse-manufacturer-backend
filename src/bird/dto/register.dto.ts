import { IsNumber, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(4, 16)
  name!: string;

  @IsNumber()
  longitude!: number;

  @IsNumber()
  latitude!: number;
}
