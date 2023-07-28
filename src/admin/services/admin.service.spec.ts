import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import { Birdhouse, Residency } from '&/domain/entities';
import { v4 as uuid } from 'uuid';
import { BirdhouseNotFoundException } from '&/core/exceptions';

describe('AdminService', () => {
  let service: AdminService;
  let birdhouseRepo: BirdhouseRepository;
  let residencyRepo: ResidencyRepository;

  let birdhouse: Birdhouse;
  let residency: Residency;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: BirdhouseRepository,
          useValue: {
            findAll: jest.fn(),
            count: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ResidencyRepository,
          useValue: {
            findByBirdhouseId: jest.fn(),
            countByBirdhouseId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    birdhouseRepo = module.get<BirdhouseRepository>(BirdhouseRepository);
    residencyRepo = module.get<ResidencyRepository>(ResidencyRepository);

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

    birdhouse.residency = residency;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listBirdhouses', () => {
    it('should return a page of birdhouses', async () => {
      jest.spyOn(birdhouseRepo, 'findAll').mockResolvedValueOnce([birdhouse]);
      jest.spyOn(birdhouseRepo, 'count').mockResolvedValueOnce(1);

      const result = await service.listBirdhouses({ page: 1, perPage: 10 });

      expect(result.total).toBe(1);
      expect(result.pageCount).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.page).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(birdhouse);
    });
  });

  describe('getHistory', () => {
    it('should return a page of residencies', async () => {
      jest.spyOn(birdhouseRepo, 'findOne').mockResolvedValueOnce(birdhouse);

      jest
        .spyOn(residencyRepo, 'findByBirdhouseId')
        .mockResolvedValueOnce([residency]);
      jest.spyOn(residencyRepo, 'countByBirdhouseId').mockResolvedValueOnce(1);

      const result = await service.getHistory(birdhouse.id!, {
        page: 1,
        perPage: 10,
      });

      expect(result.total).toBe(1);
      expect(result.pageCount).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.page).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(residency);
    });

    it('should throw an error if the birdhouse does not exist', async () => {
      jest.spyOn(birdhouseRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.getHistory(birdhouse.id!, { page: 1, perPage: 10 }),
      ).rejects.toThrow(new BirdhouseNotFoundException(birdhouse.id!));
    });
  });
});
