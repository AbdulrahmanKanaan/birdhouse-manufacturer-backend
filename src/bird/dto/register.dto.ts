import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'name of registered birdhouse',
    minimum: 4,
    maximum: 16,
  })
  @IsString()
  @Length(4, 16)
  name!: string;

  @ApiProperty({ description: 'birdhouse location longitude' })
  @IsNumber()
  longitude!: number;

  @ApiProperty({ description: 'birdhouse location latitude' })
  @IsNumber()
  latitude!: number;
}
