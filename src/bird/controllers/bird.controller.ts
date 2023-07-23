import { UsePresenter } from '&/common/decorators';
import { Birdhouse } from '&/domain/entities';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CanManipulateGuard } from '../auth';
import { RegisterDto } from '../dto';
import { AddResidencyDto } from '../dto/add-residency.dto';
import { UpdateHouseDto } from '../dto/update-house.dto';
import { BirdhousePresenter, RegisterPresenter } from '../presenter';
import { BirdService } from '../services';
import { HouseService as HouseService } from '&/core/services';

@Controller('house')
export class BirdController {
  constructor(
    private readonly birdService: BirdService,
    private readonly houseService: HouseService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UsePresenter(RegisterPresenter)
  public async createBirdhouse(
    @Body() registerDto: RegisterDto,
  ): Promise<Birdhouse> {
    return await this.birdService.createBirdhouse(registerDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, CanManipulateGuard)
  @UsePresenter(BirdhousePresenter)
  public async getBirdhouse(@Param('id') id: string): Promise<Birdhouse> {
    return await this.houseService.getBirdhouse(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, CanManipulateGuard)
  @UsePresenter(BirdhousePresenter)
  public async updateBirdhouse(
    @Param('id') id: string,
    @Body() updateHouseDto: UpdateHouseDto,
  ): Promise<Birdhouse> {
    return await this.birdService.updateBirdhouse(id, updateHouseDto);
  }

  @Post(':id/residency')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, CanManipulateGuard)
  @UsePresenter(BirdhousePresenter)
  public async addResidency(
    @Param('id') id: string,
    @Body() addResidencyDto: AddResidencyDto,
  ): Promise<Birdhouse> {
    return await this.birdService.addResidency(id, addResidencyDto);
  }
}
