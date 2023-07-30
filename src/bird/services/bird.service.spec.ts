import { BirdhouseNotFoundException } from '&/core/exceptions';
import { Birdhouse, Residency } from '&/domain/entities';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import {
  EntityNotFoundException,
  EntityValidationException,
} from '&/domain/repositories/exceptions';
import { LoggerService } from '&/domain/services';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import {
  BirdhouseCreateFailedException,
  BirdhouseUpdateFailedException,
  ResidencyCreateFailedException,
} from '../exceptions';
import { BirdService } from './bird.service';

describe('BirdService', () => {
  let service: BirdService;

  let birdhouseRepo: BirdhouseRepository;
  let residencyRepo: ResidencyRepository;

  let birdhouse: Birdhouse;
  let residency: Residency;

  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdService,
        {
          provide: BirdhouseRepository,
          useValue: {
            create: jest.fn(async () => birdhouse),
            findOne: jest.fn(async () => birdhouse),
            update: jest.fn(async () => birdhouse),
          },
        },
        {
          provide: ResidencyRepository,
          useValue: {
            create: jest.fn(async () => residency),
            findByBirdhouseId: jest.fn(async () => residency),
            countByBirdhouseId: jest.fn(async () => 1),
          },
        },
        {
          provide: LoggerService,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BirdService>(BirdService);

    birdhouseRepo = module.get<BirdhouseRepository>(BirdhouseRepository);
    residencyRepo = module.get<ResidencyRepository>(ResidencyRepository);
    logger = module.get(LoggerService);

    birdhouse = new Birdhouse(
      uuid(),
      uuid(),
      'test name',
      12.34,
      56.78,
      1,
      new Date(),
      new Date(),
      null,
    );

    residency = new Residency(1, birdhouse.id!, 1, 2, new Date(), new Date());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBirdhouse', () => {
    it('should create a birdhouse', async () => {
      jest.spyOn(logger, 'log');

      const result = await service.createBirdhouse({
        name: birdhouse.name,
        longitude: birdhouse.longitude,
        latitude: birdhouse.latitude,
      });

      expect(logger.log).toHaveBeenCalledTimes(1);

      expect(result).toEqual(birdhouse);
    });

    it('should throw an error if the birdhouse could not be created', async () => {
      jest
        .spyOn(birdhouseRepo, 'create')
        .mockRejectedValueOnce(
          new EntityValidationException({ entity: birdhouse }),
        );

      await expect(
        service.createBirdhouse({
          name: birdhouse.name,
          longitude: birdhouse.longitude,
          latitude: birdhouse.latitude,
        }),
      ).rejects.toThrowError(new BirdhouseCreateFailedException());
    });
  });

  describe('updateBirdhouse', () => {
    it('should update a birdhouse', async () => {
      jest.spyOn(logger, 'log');

      const result = await service.updateBirdhouse(birdhouse.id!, {
        name: birdhouse.name,
        longitude: birdhouse.longitude,
        latitude: birdhouse.latitude,
      });

      expect(logger.log).toHaveBeenCalledTimes(1);

      expect(result).toEqual(birdhouse);
    });

    it('should throw not found error if the birdhouse could not be found', async () => {
      jest
        .spyOn(birdhouseRepo, 'update')
        .mockRejectedValueOnce(
          new EntityNotFoundException({ id: birdhouse.id }),
        );

      await expect(
        service.updateBirdhouse(birdhouse.id!, {
          name: birdhouse.name,
          longitude: birdhouse.longitude,
          latitude: birdhouse.latitude,
        }),
      ).rejects.toThrowError(new BirdhouseNotFoundException(birdhouse.id!));
    });

    it('should throw an error if the birdhouse could not be updated', async () => {
      jest
        .spyOn(birdhouseRepo, 'update')
        .mockRejectedValueOnce(
          new EntityValidationException({ entity: birdhouse }),
        );

      await expect(
        service.updateBirdhouse(birdhouse.id!, {
          name: birdhouse.name,
          longitude: birdhouse.longitude,
          latitude: birdhouse.latitude,
        }),
      ).rejects.toThrowError(new BirdhouseUpdateFailedException(birdhouse.id!));
    });
  });

  describe('addResidency', () => {
    it('should add a residency to a birdhouse', async () => {
      jest.spyOn(logger, 'log');

      const result = await service.addResidency(birdhouse.id!, {
        eggs: residency.eggs,
        birds: residency.birds,
      });

      expect(logger.log).toHaveBeenCalledTimes(1);

      expect(result).toEqual(birdhouse);
      expect(result.residency).toEqual(residency);
    });

    it('should throw not found error if the birdhouse could not be found', async () => {
      jest.spyOn(birdhouseRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.addResidency(birdhouse.id!, {
          eggs: residency.eggs,
          birds: residency.birds,
        }),
      ).rejects.toThrowError(new BirdhouseNotFoundException(birdhouse.id!));
    });

    it('should throw an error if residency could not be added', async () => {
      jest
        .spyOn(residencyRepo, 'create')
        .mockRejectedValueOnce(
          new EntityValidationException({ entity: residency }),
        );

      await expect(
        service.addResidency(birdhouse.id!, {
          eggs: residency.eggs,
          birds: residency.birds,
        }),
      ).rejects.toThrowError(
        new ResidencyCreateFailedException(
          `couldn't add residency ${JSON.stringify(residency)}`,
        ),
      );
    });

    it('should throw an error if birdhouse could not be updated', async () => {
      jest
        .spyOn(birdhouseRepo, 'update')
        .mockRejectedValueOnce(
          new EntityValidationException({ entity: birdhouse }),
        );

      await expect(
        service.addResidency(birdhouse.id!, {
          eggs: residency.eggs,
          birds: residency.birds,
        }),
      ).rejects.toThrowError(new BirdhouseUpdateFailedException(birdhouse.id!));
    });
  });
});
