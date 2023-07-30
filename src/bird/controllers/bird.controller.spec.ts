import { HouseService } from '&/core/services';
import { Birdhouse } from '&/domain/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { AuthGuard } from '../auth';
import { RegisterDto, UpdateHouseDto } from '../dto';
import { AddResidencyDto } from '../dto/add-residency.dto';
import { BirdService } from '../services';
import { BirdController } from './bird.controller';

describe('BirdController', () => {
  let controller: BirdController;

  let birdService: BirdService;
  let houseService: HouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BirdController],
      providers: [
        {
          provide: BirdService,
          useValue: {
            createBirdhouse: jest.fn(),
            updateBirdhouse: jest.fn(),
            addResidency: jest.fn(),
          },
        },
        { provide: HouseService, useValue: { getBirdhouse: jest.fn() } },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .compile();

    controller = module.get<BirdController>(BirdController);
    birdService = module.get<BirdService>(BirdService);
    houseService = module.get<HouseService>(HouseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBirdhouse', () => {
    it('should create a birdhouse and return it', async () => {
      const registerDto: RegisterDto = {
        name: 'Test name',
        latitude: 37.7749,
        longitude: -122.4194,
      };
      const birdhouse = new Birdhouse(
        uuid(),
        uuid(),
        'test',
        12.34,
        56.78,
        null,
      );
      jest
        .spyOn(birdService, 'createBirdhouse')
        .mockResolvedValueOnce(birdhouse);

      const result = await controller.createBirdhouse(registerDto);

      expect(birdService.createBirdhouse).toHaveBeenCalled();
      expect(birdService.createBirdhouse).toHaveBeenCalledWith(registerDto);
      expect(result).toBeInstanceOf(Birdhouse);
      expect(result).toEqual(birdhouse);
    });
  });

  describe('getBirdhouse', () => {
    it('should get a birdhouse by id and return it', async () => {
      const birdhouse = new Birdhouse(
        uuid(),
        uuid(),
        'test',
        12.34,
        56.78,
        null,
      );

      jest.spyOn(houseService, 'getBirdhouse').mockResolvedValueOnce(birdhouse);

      const result = await controller.getBirdhouse(birdhouse.id!);

      expect(houseService.getBirdhouse).toHaveBeenCalled();
      expect(houseService.getBirdhouse).toHaveBeenCalledWith(birdhouse.id!);
      expect(result).toBeInstanceOf(Birdhouse);
      expect(result).toEqual(birdhouse);
    });
  });

  describe('updateBirdhouse', () => {
    it('should update a birdhouse and return it', async () => {
      const updateHouseDto: UpdateHouseDto = {
        name: 'new name',
        latitude: 37.7749,
        longitude: -122.4194,
      };
      const birdhouse = new Birdhouse(
        uuid(),
        uuid(),
        'test',
        12.34,
        56.78,
        null,
      );

      jest
        .spyOn(birdService, 'updateBirdhouse')
        .mockResolvedValueOnce(birdhouse);

      const result = await controller.updateBirdhouse(
        birdhouse.id!,
        updateHouseDto,
      );

      expect(birdService.updateBirdhouse).toHaveBeenCalled();
      expect(birdService.updateBirdhouse).toHaveBeenCalledWith(
        birdhouse.id!,
        updateHouseDto,
      );
      expect(result).toBeInstanceOf(Birdhouse);
      expect(result).toEqual(birdhouse);
    });
  });

  describe('addResidency', () => {
    it('should add a residency to a birdhouse and return it', async () => {
      const addResidencyDto: AddResidencyDto = {
        eggs: 1,
        birds: 2,
      };
      const birdhouse = new Birdhouse(
        uuid(),
        uuid(),
        'test',
        12.34,
        56.78,
        null,
      );

      jest.spyOn(birdService, 'addResidency').mockResolvedValueOnce(birdhouse);

      const result = await controller.addResidency(
        birdhouse.id!,
        addResidencyDto,
      );

      expect(birdService.addResidency).toHaveBeenCalled();
      expect(birdService.addResidency).toHaveBeenCalledWith(
        birdhouse.id!,
        addResidencyDto,
      );
      expect(result).toBeInstanceOf(Birdhouse);
      expect(result).toEqual(birdhouse);
    });
  });
});
