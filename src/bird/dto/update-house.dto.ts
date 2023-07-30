import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class UpdateHouseDto extends PartialType(RegisterDto) {}
