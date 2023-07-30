import { v4 as uuid } from 'uuid';
import { BirdhouseSequelizeMapper } from './birdhouse-sequelize.mapper';
import { Birdhouse, Residency } from '&/domain/entities';
import { BirdhouseModel } from '&/infrastructure/repositories/models';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ResidencyMapper } from '&/domain/mappers';

describe('BirdhouseSequelizeMapper', () => {
  let houseMapper: BirdhouseSequelizeMapper;
  let houseModel: typeof BirdhouseModel;

  const residencyData = {
    id: 3,
    birds: 4,
    eggs: 5,
  };

  const data = {
    id: uuid(),
    ubid: uuid(),
    name: 'test',
    longitude: 1,
    latitude: 2,
    residencyId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    residency: residencyData as Residency,
    history: Array(3).fill(residencyData),
  } satisfies Birdhouse;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BirdhouseSequelizeMapper,
        {
          provide: ResidencyMapper,
          useValue: { toEntity: jest.fn((data: any) => data) },
        },
        {
          provide: getModelToken(BirdhouseModel),
          useValue: { build: jest.fn((data) => data) },
        },
      ],
    }).compile();

    houseMapper = moduleRef.get(BirdhouseSequelizeMapper);
    houseModel = moduleRef.get(getModelToken(BirdhouseModel));
  });

  describe('toModel', () => {
    it('should return a BirdhouseModel', async () => {
      const entity = new Birdhouse(
        data.id,
        data.ubid,
        data.name,
        data.longitude,
        data.latitude,
        data.residencyId,
        data.createdAt,
        data.updatedAt,
        data.deletedAt,
      );

      const result = houseMapper.toModel(entity);

      // make sure we're using the sequelize model correctly
      expect(houseModel.build).toHaveBeenCalledTimes(1);
      expect(houseModel.build).toHaveBeenCalledWith(entity);

      expect(result.id).toBe(data.id);
    });
  });

  describe('toEntity', () => {
    it('should return a Birdhouse entity', async () => {
      const model = {
        id: data.id,
        ubid: data.ubid,
        name: data.name,
        longitude: data.longitude,
        latitude: data.latitude,
        residencyId: data.residencyId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        residency: data.residency,
        history: data.history,
      };

      const result = houseMapper.toEntity(model as BirdhouseModel);

      // make sure the mapped data is correct
      expect(result).toBeInstanceOf(Birdhouse);
      expect(result.id).toBe(data.id);
      expect(result.ubid).toBe(data.ubid);
      expect(result.name).toBe(data.name);
      expect(result.longitude).toBe(data.longitude);
      expect(result.latitude).toBe(data.latitude);
      expect(result.residencyId).toBe(data.residencyId);
      expect(result.createdAt).toBe(data.createdAt);
      expect(result.updatedAt).toBe(data.updatedAt);
      expect(result.deletedAt).toBe(data.deletedAt);

      // Make sure it also mapped the residency relation
      expect(result.residency?.id).toBe(data.residency.id);
      expect(result.residency?.birds).toBe(data.residency.birds);
      expect(result.residency?.eggs).toBe(data.residency.eggs);

      // Make sure it mapped the history relation
      expect(result.history).toHaveLength(data.history.length);
    });
  });
});
