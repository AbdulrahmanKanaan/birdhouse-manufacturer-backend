import { v4 as uuid } from 'uuid';
import { BirdhouseSequelizeMapper } from './birdhouse-sequelize.mapper';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseModel } from '&/core/models';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

describe('BirdhouseSequelizeMapper', () => {
  let mapper: BirdhouseSequelizeMapper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BirdhouseSequelizeMapper,
        {
          provide: getModelToken(BirdhouseModel),
          useValue: { build: jest.fn((data) => data) },
        },
      ],
    }).compile();

    mapper = moduleRef.get(BirdhouseSequelizeMapper);
  });

  describe('toModel', () => {
    it('should return a BirdhouseModel', async () => {
      const id = uuid();
      const ubid = uuid();

      const expected = {
        id: id,
        ubid: ubid,
        name: 'test',
        latitude: 1,
        longitude: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const entity = new Birdhouse(
        id,
        ubid,
        'test',
        1,
        1,
        new Date(),
        new Date(),
        null,
      );

      const result = mapper.toModel(entity);

      expect(result).toEqual(expected);
    });
  });

  describe('toEntity', () => {
    it('should return a Birdhouse', async () => {
      const id = uuid();
      const ubid = uuid();

      const expected = new Birdhouse(
        id,
        ubid,
        'test',
        1,
        1,
        new Date(),
        new Date(),
        null,
      );

      const model = {
        id: id,
        ubid: ubid,
        name: 'test',
        latitude: 1,
        longitude: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const result = mapper.toEntity(model as BirdhouseModel);

      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Birdhouse);
    });
  });
});
