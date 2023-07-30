import { RepositoryException } from '&/domain/repositories/exceptions';
import { LoggerService } from '&/domain/services';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HouseService } from '../services';

@Injectable()
export class BirdhouseCron {
  constructor(
    private readonly houseService: HouseService,
    @Inject(LoggerService)
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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
