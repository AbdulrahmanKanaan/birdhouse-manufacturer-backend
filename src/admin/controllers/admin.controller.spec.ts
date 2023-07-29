import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from '../services';
import { HouseService } from '&/core/services';
import { v4 } from 'uuid';
import { Birdhouse, Residency } from '&/domain/entities';
import { Page } from '&/common/types';
import { ListHousesDto } from '../dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;
  let houseService: HouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            listBirdhouses: jest.fn(),
            getHistory: jest.fn(),
          },
        },
        { provide: HouseService, useValue: { getBirdhouse: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
    houseService = module.get<HouseService>(HouseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listHouses', () => {
    it('should return a page of birdhouses', async () => {
      const birdhouse = new Birdhouse(v4(), v4(), 'test', 12.34, 56.78, null);

      const dto: ListHousesDto = {
        page: 1,
        perPage: 10,
      };

      const page = new Page([birdhouse], 1, dto.page, dto.perPage);

      jest.spyOn(adminService, 'listBirdhouses').mockResolvedValue(page);

      const result = await controller.listHouses(dto);

      expect(adminService.listBirdhouses).toHaveBeenCalled();
      expect(adminService.listBirdhouses).toHaveBeenCalledWith(dto);
      expect(result).toEqual(page);
    });
  });

  describe('getBirdhouse', () => {
    it('should return a birdhouse', async () => {
      const birdhouse = new Birdhouse(v4(), v4(), 'test', 12.34, 56.78, null);

      jest.spyOn(houseService, 'getBirdhouse').mockResolvedValue(birdhouse);

      const result = await controller.getBirdhouse(birdhouse.id!);

      expect(houseService.getBirdhouse).toHaveBeenCalled();
      expect(houseService.getBirdhouse).toHaveBeenCalledWith(birdhouse.id);
      expect(result).toEqual(birdhouse);
    });
  });

  describe('getHistory', () => {
    it('should return a page of residencies', async () => {
      const birdhouse = new Birdhouse(v4(), v4(), 'test', 12.34, 56.78, null);
      const residency = new Residency(1, birdhouse.id!, 2, 3);

      const dto: ListHousesDto = {
        page: 1,
        perPage: 10,
      };

      const page = new Page<Residency>([residency], 1, dto.page, dto.perPage);

      jest.spyOn(adminService, 'getHistory').mockResolvedValue(page);

      const result = await controller.getHistory(birdhouse.id!, dto);

      expect(adminService.getHistory).toHaveBeenCalled();
      expect(adminService.getHistory).toHaveBeenCalledWith(birdhouse.id, dto);
      expect(result).toEqual(page);
    });
  });
});
