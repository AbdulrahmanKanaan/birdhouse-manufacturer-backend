import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HouseService } from '../services';

@Injectable()
export class BirdhouseCron {
  constructor(private readonly houseService: HouseService) {}

  @Cron('0 0 * * *')
  async destroyOutdatedBirdhouses() {
    try {
      await this.houseService.destroyOutdatedBirdhouses();
    } catch (e) {
      // TODO: log error
    }
  }
}
