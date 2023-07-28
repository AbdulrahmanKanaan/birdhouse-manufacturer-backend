import { Test, TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { BirdhouseRepository } from '&/domain/repositories';
import { Birdhouse } from '&/domain/entities';
import { v4 as uuid } from 'uuid';
import {
  BirdhouseDeleteFailedException,
  BirdhouseNotFoundException,
} from '&/core/exceptions';
import { RepositoryException } from '&/domain/repositories/exceptions';

describe('HouseService', () => {
  let service: HouseService;
  let birdhouseRepo: BirdhouseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HouseService,
        {
          provide: BirdhouseRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            getOutdatedBirdhouses: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HouseService>(HouseService);
    birdhouseRepo = module.get(BirdhouseRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBirdhouse', () => {
    it('should return a birdhouse', async () => {
      const id = uuid();
      const birdhouse = new Birdhouse(
        id,
        uuid(),
        'test name',
        123.456,
        789.123,
        1,
      );

      jest.spyOn(birdhouseRepo, 'findOne').mockResolvedValueOnce(birdhouse);

      const result = await service.getBirdhouse(id);

      expect(result).toEqual(birdhouse);
      expect(result).toBeInstanceOf(Birdhouse);
    });

    it('should throw BirdhouseNotFoundException if requested birdhouse could not be found', async () => {
      const id = uuid();

      jest.spyOn(birdhouseRepo, 'findOne').mockResolvedValueOnce(null);

      expect(service.getBirdhouse(id)).rejects.toThrow(
        new BirdhouseNotFoundException(id),
      );
    });
  });

  describe('destroyOutdatedBirdhouses', () => {
    it('should delete outdated birdhouses successfully', async () => {
      // Mock the `getOutdatedBirdhouses` method of the `birdhouseRepo` to return an array of mock birdhouse entities
      const id = uuid();
      const birdhouse = new Birdhouse(
        id,
        uuid(),
        'test name',
        123.456,
        789.123,
        1,
      );
      let calledWithDate: Date;
      jest
        .spyOn(birdhouseRepo, 'getOutdatedBirdhouses')
        .mockImplementationOnce((date) => {
          calledWithDate = date;
          return Promise.resolve([birdhouse]);
        });

      // Call the `destroyOutdatedBirdhouses` method
      await service.destroyOutdatedBirdhouses();

      expect(birdhouseRepo.getOutdatedBirdhouses).toBeCalled();
      expect(calledWithDate!.getFullYear()).toBe(new Date().getFullYear() - 1);

      // Assert that the `delete` method of the `birdhouseRepo` was called with the correct arguments
      expect(birdhouseRepo.delete).toHaveBeenCalledWith({ id: [id] });
    });

    it('should throw BirdhouseDeleteFailedException if an error occurs while deleting outdated birdhouses', async () => {
      // Mock the `getOutdatedBirdhouses` method of the `birdhouseRepo` to throw a `RepositoryException`

      jest
        .spyOn(birdhouseRepo, 'getOutdatedBirdhouses')
        .mockResolvedValueOnce([]);

      jest
        .spyOn(birdhouseRepo, 'delete')
        .mockRejectedValueOnce(new RepositoryException());

      // assert that it throws a `BirdhouseDeleteFailedException`
      await expect(service.destroyOutdatedBirdhouses()).rejects.toThrow(
        BirdhouseDeleteFailedException,
      );
    });
  });
});
