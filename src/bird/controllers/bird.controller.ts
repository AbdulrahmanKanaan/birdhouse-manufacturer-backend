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
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dto';
import { UpdateHouseDto } from '../dto/update-house.dto';
import { BirdhousePresenter, RegisterPresenter } from '../presenter';
import { BirdService } from '../services';
import { AddResidencyDto } from '../dto/add-residency.dto';
import { AuthGuard, CanManipulateGuard } from '../auth';
import { Request } from 'express';

@Controller('house')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

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
  public async getBirdhouse(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Birdhouse> {
    console.log((req as any).housesIds);
    return await this.birdService.getBirdhouse(id);
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
