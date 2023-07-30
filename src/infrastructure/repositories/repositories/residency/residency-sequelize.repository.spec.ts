import { ResidencyModel } from '&/infrastructure/repositories/models';
import { Residency } from '&/domain/entities';
import { ResidencyMapper } from '&/domain/mappers';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { ResidencySequelizeRepository } from './residency-sequelize.repository';

describe('ResidencySequelizeRepository', () => {
  let repo: ResidencySequelizeRepository;
  let residencyModel: typeof ResidencyModel;

  let residencyData: any;
  let residencyEntity: Residency;
  let residencyModelInstance: ResidencyModel;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ResidencySequelizeRepository,
        {
          provide: ResidencyMapper,
          useValue: {
            toModel: jest.fn(() => residencyModelInstance),
            toEntity: jest.fn(() => residencyEntity),
          },
        },
        {
          provide: getModelToken(ResidencyModel),
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    repo = moduleRef.get(ResidencySequelizeRepository);
    residencyModel = moduleRef.get(getModelToken(ResidencyModel));

    residencyData = {
      id: 1,
      birds: 2,
      eggs: 3,
      birdhouseId: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    residencyEntity = new Residency(
      residencyData.id,
      residencyData.birdhouseId,
      residencyData.birds,
      residencyData.eggs,
      residencyData.createdAt,
      residencyData.updatedAt,
    );

    residencyModelInstance = {
      ...residencyData,
      save: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };
  });

  describe('findByBirdhouseId', () => {
    it('should return residency entity if residency is found', async () => {
      // the result of findAll method from sequelize model
      jest
        .spyOn(residencyModel, 'findAll')
        .mockResolvedValueOnce([residencyModelInstance]);

      // call the method
      const result = await repo.findByBirdhouseId(residencyData.birdhouseId, {
        limit: 1,
        skip: 0,
      });

      // check if the method was called with the right arguments
      expect(residencyModel.findAll).toHaveBeenCalledWith({
        where: { birdhouseId: residencyData.birdhouseId },
        limit: 1,
        offset: 0,
      });

      // check if the result is correct
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(residencyEntity);
    });
  });

  describe('countByBirdhouseId', () => {
    it('should return number of residencies', async () => {
      // the result of count method from sequelize model
      jest.spyOn(residencyModel, 'count').mockResolvedValueOnce(1);

      // call the method
      const result = await repo.countByBirdhouseId(residencyData.birdhouseId);

      // check if the method was called with the right arguments
      expect(residencyModel.count).toHaveBeenCalledWith({
        where: { birdhouseId: residencyData.birdhouseId },
      });

      // check if the result is correct
      expect(result).toBe(1);
    });
  });

  describe('create', () => {
    it('should return residency entity if residency is created', async () => {
      // the result of save method from sequelize model
      jest
        .spyOn(residencyModelInstance, 'save')
        .mockResolvedValueOnce(residencyModelInstance);

      // call the method
      const result = await repo.create(residencyEntity);

      // check if the save method was actually called
      expect(residencyModelInstance.save).toHaveBeenCalled();

      // check if the result is correct
      expect(result).toEqual(residencyEntity);
    });
  });
});
