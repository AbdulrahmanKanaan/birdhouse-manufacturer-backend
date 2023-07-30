import { Test, TestingModule } from '@nestjs/testing';
import { BirdhouseCron } from './birdhouse.cron';
import { HouseService } from '../services';
import { LoggerService } from '&/infrastructure/logger/logger.service';
import { RepositoryException } from '&/domain/repositories/exceptions';

describe('BirdhouseCron', () => {
  let cron: BirdhouseCron;
  let houseService: HouseService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdhouseCron,
        {
          provide: HouseService,
          useValue: { destroyOutdatedBirdhouses: jest.fn() },
        },
        { provide: LoggerService, useValue: { error: jest.fn() } },
      ],
    }).compile();

    cron = module.get<BirdhouseCron>(BirdhouseCron);
    houseService = module.get<HouseService>(HouseService);
    logger = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(cron).toBeDefined();
  });

  describe('destroyOutdatedBirdhouses', () => {
    it('should call the service', async () => {
      jest.spyOn(houseService, 'destroyOutdatedBirdhouses');

      await cron.destroyOutdatedBirdhouses();

      expect(houseService.destroyOutdatedBirdhouses).toHaveBeenCalled();
    });

    it('should log an error if the service throws an exception', async () => {
      const exception = new RepositoryException({
        message: 'error',
        error: new Error(),
      });
      jest
        .spyOn(houseService, 'destroyOutdatedBirdhouses')
        .mockRejectedValue(exception);

      await cron.destroyOutdatedBirdhouses();

      expect(logger.error).toHaveBeenCalledWith(
        exception.message,
        exception.error?.stack,
        BirdhouseCron.name,
      );
    });
  });
});
