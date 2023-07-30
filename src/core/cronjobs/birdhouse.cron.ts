import { RepositoryException } from '&/domain/repositories/exceptions';
import { LoggerService } from '&/domain/services';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HouseService } from '../services';

@Injectable()
export class BirdhouseCron {
  constructor(
    private readonly houseService: HouseService,
    @Inject(LoggerService)
    private readonly logger: LoggerService,
  ) {}

  @Cron('0 0 * * *') // Cronjob that runs every day at midnight
  async destroyOutdatedBirdhouses() {
    try {
      await this.houseService.destroyOutdatedBirdhouses();
    } catch (e) {
      if (e instanceof RepositoryException) {
        this.logger.error(e.message, e?.error?.stack, BirdhouseCron.name);
      }
    }
  }
}
