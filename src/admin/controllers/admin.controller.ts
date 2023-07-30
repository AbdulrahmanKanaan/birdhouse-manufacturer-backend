import { UsePresenter } from '&/common/decorators';
import { Page } from '&/common/types';
import { HouseService } from '&/core/services';
import { Birdhouse, Residency } from '&/domain/entities';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListHistoryDto } from '../dto';
import { ListHousesDto } from '../dto/list-houses.dto';
import {
  GetHistoryPresenter,
  HousePresenter,
  ListHousesPresenter,
} from '../presenter';
import { AdminService } from '../services';

@ApiTags('Admin')
@Controller('admin/houses')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly houseService: HouseService,
  ) {}

  @Get('/')
  @UsePresenter(ListHousesPresenter)
  @ApiOkResponse()
  async listHouses(
    @Query() listHousesDto: ListHousesDto,
  ): Promise<Page<Birdhouse>> {
    return this.adminService.listBirdhouses(listHousesDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UsePresenter(HousePresenter)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  public async getBirdhouse(@Param('id') id: string): Promise<Birdhouse> {
    return await this.houseService.getBirdhouse(id);
  }

  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  @UsePresenter(GetHistoryPresenter)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  public async getHistory(
    @Param('id') id: string,
    @Query() listHistoryDto: ListHistoryDto,
  ): Promise<Page<Residency>> {
    return await this.adminService.getHistory(id, listHistoryDto);
  }
}
