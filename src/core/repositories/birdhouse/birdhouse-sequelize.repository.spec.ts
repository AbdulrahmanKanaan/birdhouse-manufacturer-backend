import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BirdhouseMutationFailedException,
  BirdhouseNotFoundException,
} from '&/core/exceptions';
import { BirdhouseModel } from '&/core/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseSequelizeMapper } from './birdhouse-sequelize.mapper';
import { BirdhouseSequelizeRepository } from './birdhouse-sequelize.repository';
import { v4 as uuid } from 'uuid';
import { BirdhouseMapper } from '&/domain/mappers';

describe('BirdhouseSequelizeRepository', () => {
  let birdhouseSequelizeRepository: BirdhouseSequelizeRepository;
  let birdhouseSequelizeMapper: BirdhouseSequelizeMapper;
  let birdhouseModel: typeof BirdhouseModel;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BirdhouseSequelizeRepository,
        { provide: BirdhouseMapper, useClass: BirdhouseSequelizeMapper },
        {
          provide: getModelToken(BirdhouseModel),
          useValue: {
            findOne: jest.fn(),
            build: jest.fn((data) => ({
              ...data,
              save: jest.fn(),
              update: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    birdhouseSequelizeRepository = moduleRef.get<BirdhouseSequelizeRepository>(
      BirdhouseSequelizeRepository,
    );
    birdhouseSequelizeMapper =
      moduleRef.get<BirdhouseSequelizeMapper>(BirdhouseMapper);
    birdhouseModel = moduleRef.get(getModelToken(BirdhouseModel));
  });

  describe('create', () => {
    it('should create a new birdhouse and return the mapped entity', async () => {
      const id = uuid();
      const ubid = uuid();

      // the data to be used to create the birdhouse
      const birdhouseData = {
        id: id,
        ubid: ubid,
        name: 'name',
        longitude: 123.456,
        latitude: 789.012,
      };

      // the model instance that should be created by Sequelize
      const birdhouseModelInstance = birdhouseModel.build(birdhouseData);

      const birdhouseEntity = new Birdhouse(
        birdhouseData.id,
        birdhouseData.ubid,
        birdhouseData.name,
        birdhouseData.longitude,
        birdhouseData.latitude,
        new Date(),
        new Date(),
        null,
      );

      // the instance returned when converting the passed data to sequelize model
      jest
        .spyOn(birdhouseSequelizeMapper, 'toModel')
        .mockReturnValueOnce(birdhouseModelInstance);

      // the returned instance when saving data using the model
      jest
        .spyOn(birdhouseModelInstance, 'save')
        .mockResolvedValueOnce(birdhouseModelInstance);

      // the entity returned by the repository
      jest
        .spyOn(birdhouseSequelizeMapper, 'toEntity')
        .mockReturnValueOnce(birdhouseEntity);

      // call the create method of the repository
      const result = await birdhouseSequelizeRepository.create(birdhouseData);

      // assert that the model instance was saved
      expect(birdhouseModelInstance.save).toHaveBeenCalled();

      // assert that the repository returned the expected entity
      expect(result).toEqual(birdhouseEntity);
    });

    it('should throw a BirdhouseCreateFailedException if the model save fails', async () => {
      const id = uuid();
      const ubid = uuid();

      // the data to be used to create the birdhouse
      const birdhouseData = {
        id: id,
        ubid: ubid,
        name: 'name',
        longitude: 123.456,
        latitude: 789.012,
      };

      // the model instance that should be created by Sequelize
      const birdhouseModelInstance = birdhouseModel.build(birdhouseData);

      // the instance returned when converting the passed data to sequelize model
      jest
        .spyOn(birdhouseSequelizeMapper, 'toModel')
        .mockReturnValueOnce(birdhouseModelInstance);

      // the error returned when saving data using the model
      jest
        .spyOn(birdhouseModelInstance, 'save')
        .mockRejectedValueOnce(new Error());

      // call the create method of the repository and assert that it throws the expected exception
      await expect(
        birdhouseSequelizeRepository.create(birdhouseData),
      ).rejects.toThrow(BirdhouseMutationFailedException);
    });
  });

  describe('update', () => {
    it('should update an existing birdhouse and return the mapped entity', async () => {
      const id = uuid();
      const ubid = uuid();
      const filters = { id };
      const updatedBirdhouseData = { name: 'new name' };

      // the data for the existing birdhouse
      const birdhouseData = {
        id: id,
        ubid: ubid,
        name: 'name',
        longitude: 123.456,
        latitude: 789.012,
      };

      // the model instance for the existing birdhouse
      const oldBirdhouseModelInstance = birdhouseModel.build({
        ...birdhouseData,
      });

      // the model instance for the updated birdhouse
      const updatedBirdhouseModelInstance = birdhouseModel.build({
        ...birdhouseData,
        ...updatedBirdhouseData,
      });

      // the entity that should be returned by the repository
      const birdhouseEntity = new Birdhouse(
        birdhouseData.id,
        birdhouseData.ubid,
        updatedBirdhouseData.name,
        birdhouseData.longitude,
        birdhouseData.latitude,
        new Date(),
        new Date(),
        null,
      );

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(oldBirdhouseModelInstance);

      // the model instance returned by the update method
      jest
        .spyOn(oldBirdhouseModelInstance, 'update')
        .mockResolvedValueOnce(updatedBirdhouseModelInstance);

      // the entity returned by the repository
      jest
        .spyOn(birdhouseSequelizeMapper, 'toEntity')
        .mockReturnValueOnce(birdhouseEntity);

      // call the update method of the repository
      const result = await birdhouseSequelizeRepository.update(
        filters,
        updatedBirdhouseData,
      );

      // check if we are searching for the model using the id
      expect(birdhouseModel.findOne).toHaveBeenCalledWith({
        where: { id: filters.id },
      });

      // check if the model was updated using the passed data
      expect(oldBirdhouseModelInstance.update).toHaveBeenCalledWith(
        updatedBirdhouseData,
      );

      // check if the repository returned the expected entity
      expect(result).toEqual(birdhouseEntity);
      expect(result).toBeInstanceOf(Birdhouse);
    });

    it('should throw a BirdhouseNotFoundException if the birdhouse does not exist', async () => {
      const filters = { id: uuid() };
      const updatedBirdhouseData = { name: 'new name' };

      // the model instance that should be returned by Sequelize
      jest.spyOn(birdhouseModel, 'findOne').mockResolvedValue(null);

      // call the update method of the repository and assert that it throws the expected exception
      await expect(
        birdhouseSequelizeRepository.update(filters, updatedBirdhouseData),
      ).rejects.toThrow(BirdhouseNotFoundException);
    });

    it('should throw a BirdhouseMutationFailedException if the model update fails', async () => {
      const id = uuid();
      const ubid = uuid();
      const filters = { id };
      const updatedBirdhouseData = { name: 'new name' };

      // the data for the existing birdhouse
      const birdhouseData = {
        id: id,
        ubid: ubid,
        name: 'name',
        longitude: 123.456,
        latitude: 789.012,
      };

      // the model instance for the existing birdhouse
      const oldBirdhouseModelInstance = birdhouseModel.build({
        ...birdhouseData,
      });

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(oldBirdhouseModelInstance);

      // the error returned by the update method
      jest
        .spyOn(oldBirdhouseModelInstance, 'update')
        .mockRejectedValueOnce(new Error());

      // call the update method of the repository and assert that it throws the expected exception
      await expect(
        birdhouseSequelizeRepository.update(filters, updatedBirdhouseData),
      ).rejects.toThrow(BirdhouseMutationFailedException);
    });
  });
});
