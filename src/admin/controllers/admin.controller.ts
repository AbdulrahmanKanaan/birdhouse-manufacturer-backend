import { UsePresenter } from '&/common/decorators';
import { Page } from '&/common/types';
import { HouseService } from '&/core/services';
import { Birdhouse, Residency } from '&/domain/entities';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ListHousesDto } from '../dto/list-houses.dto';
import {
  GetHistoryPresenter,
  HousePresenter,
  ListHousesPresenter,
} from '../presenter';
import { AdminService } from '../services';

@Controller('admin/houses')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly houseService: HouseService,
  ) {}

  @Get('/')
  @UsePresenter(ListHousesPresenter)
  async listHouses(
    @Body() listHousesDto: ListHousesDto,
  ): Promise<Page<Birdhouse>> {
    return this.adminService.listBirdhouses(listHousesDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UsePresenter(HousePresenter)
  public async getBirdhouse(@Param('id') id: string): Promise<Birdhouse> {
    return await this.houseService.getBirdhouse(id);
  }

  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  @UsePresenter(GetHistoryPresenter)
  public async getHistory(
    @Param('id') id: string,
    @Body() listHistoryDto: ListHousesDto,
  ): Promise<Page<Residency>> {
    return await this.adminService.getHistory(id, listHistoryDto);
  }
}
