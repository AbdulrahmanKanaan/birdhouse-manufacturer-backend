import { ResidencyModel } from '&/infrastructure/repositories/models';
import { Birdhouse, Residency } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { ResidencySequelizeMapper } from './residency-sequelize.mapper';

describe('ResidencySequelizeMapper', () => {
  let residencyMapper: ResidencySequelizeMapper;
  let residencyModel: typeof ResidencyModel;

  const birdhouseData = {
    id: uuid(),
  };

  const data = {
    id: 1,
    birds: 2,
    eggs: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    birdhouseId: birdhouseData.id,
    birdhouse: birdhouseData as Birdhouse,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ResidencySequelizeMapper,
        {
          provide: getModelToken(ResidencyModel),
          useValue: { build: jest.fn((data) => data) },
        },
        {
          provide: BirdhouseMapper,
          useValue: { toEntity: jest.fn((data: any) => data) },
        },
      ],
    }).compile();

    residencyMapper = moduleRef.get(ResidencySequelizeMapper);
    residencyModel = moduleRef.get(getModelToken(ResidencyModel));
  });

  describe('toModel', () => {
    it('should return a ResidencyModel', async () => {
      const entity = new Residency(
        data.id,
        data.birdhouseId,
        data.birds,
        data.eggs,
        data.createdAt,
        data.updatedAt,
      );

      const result = residencyMapper.toModel(entity);

      // make sure we're using the sequelize model correctly
      expect(residencyModel.build).toHaveBeenCalledTimes(1);
      expect(residencyModel.build).toHaveBeenCalledWith(entity);

      expect(result.id).toBe(data.id);
    });
  });

  describe('toEntity', () => {
    it('should return a Residency entity', async () => {
      const model = {
        id: data.id,
        birds: data.birds,
        eggs: data.eggs,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        birdhouseId: data.birdhouse.id,
        birdhouse: data.birdhouse,
      };

      const result = residencyMapper.toEntity(model as ResidencyModel);

      // make sure the mapped data is correct
      expect(result).toBeInstanceOf(Residency);
      expect(result.id).toBe(data.id);
      expect(result.birds).toBe(data.birds);
      expect(result.eggs).toBe(data.eggs);
      expect(result.createdAt).toBe(data.createdAt);
      expect(result.updatedAt).toBe(data.updatedAt);

      // Make sure it also mapped the birdhouse relation
      expect(result.birdhouse?.id).toBe(data.birdhouse.id);
    });
  });
});
