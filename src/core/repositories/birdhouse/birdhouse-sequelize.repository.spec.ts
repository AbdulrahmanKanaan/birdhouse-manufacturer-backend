import { BirdhouseModel } from '&/core/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import {
  EntityCreateFailedException,
  EntityDeleteFailedException,
  EntityNotFoundException,
  EntityUpdateFailedException,
} from '&/domain/repositories/exceptions';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { BirdhouseSequelizeMapper } from './birdhouse-sequelize.mapper';
import { BirdhouseSequelizeRepository } from './birdhouse-sequelize.repository';
import { Op } from 'sequelize';

const id = uuid();
const ubid = uuid();

const birdhouseData = {
  id: id,
  ubid: ubid,
  name: 'name',
  longitude: 123.456,
  latitude: 789.012,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} satisfies Birdhouse;

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
            findAll: jest.fn(),
            count: jest.fn(),
            build: jest.fn((data) => ({
              ...data,
              save: jest.fn(),
              update: jest.fn(),
              destroy: jest.fn(),
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

  describe('findById', () => {
    it('should return the birdhouse with the passed id', async () => {
      // the model instance for the existing birdhouse
      const birdhouseModelInstance = birdhouseModel.build(birdhouseData);

      // the entity that should be returned by the repository
      const birdhouseEntity = new Birdhouse(
        birdhouseData.id,
        birdhouseData.ubid,
        birdhouseData.name,
        birdhouseData.longitude,
        birdhouseData.latitude,
        birdhouseData.createdAt,
        birdhouseData.updatedAt,
        birdhouseData.deletedAt,
      );

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(birdhouseModelInstance);

      // the entity returned by the repository
      jest
        .spyOn(birdhouseSequelizeMapper, 'toEntity')
        .mockReturnValueOnce(birdhouseEntity);

      // call the findById method of the repository
      const result = await birdhouseSequelizeRepository.findById(id);

      // check if we are searching for the model using the id
      expect(birdhouseModel.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      // check if the repository returned the expected entity
      expect(result).toEqual(birdhouseEntity);
      expect(result).toBeInstanceOf(Birdhouse);
    });

    it('should return null if the birdhouse does not exist', async () => {
      const id = uuid();

      // the model instance that should be returned by Sequelize
      jest.spyOn(birdhouseModel, 'findOne').mockResolvedValue(null);

      // call the findById method of the repository and assert that it returns null
      const result = await birdhouseSequelizeRepository.findById(id);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all birdhouses that match the passed filters', async () => {
      const filters = { name: 'name' };
      const options = { limit: 10, skip: 0 };

      // the model instance for the existing birdhouses
      const birdhouseModelInstance = birdhouseModel.build(birdhouseData);

      // the entity that should be returned by the repository
      const birdhouseEntity = new Birdhouse(
        birdhouseData.id,
        birdhouseData.ubid,
        birdhouseData.name,
        birdhouseData.longitude,
        birdhouseData.latitude,
        birdhouseData.createdAt,
        birdhouseData.updatedAt,
        birdhouseData.deletedAt,
      );

      // the model instance returned by the findAll method
      jest
        .spyOn(birdhouseModel, 'findAll')
        .mockResolvedValueOnce([birdhouseModelInstance]);

      // the entity returned by the repository
      jest
        .spyOn(birdhouseSequelizeMapper, 'toEntity')
        .mockReturnValueOnce(birdhouseEntity);

      // call the findAll method of the repository
      const result = await birdhouseSequelizeRepository.findAll(
        filters,
        options,
      );

      // check if we are searching for the model using the passed filters
      expect(birdhouseModel.findAll).toHaveBeenCalledWith({
        where: {
          name: {
            [Op.substring]: filters.name,
          },
        },
        limit: options.limit,
        offset: options.skip,
        order: undefined,
      });

      // check if the repository returned the expected entity
      expect(result).toEqual([birdhouseEntity]);
      expect(result[0]).toBeInstanceOf(Birdhouse);
    });
  });

  describe('count', () => {
    it('should return the number of birdhouses that match the passed filters', async () => {
      const filters = { name: 'name' };

      // the model instance returned by the count method
      jest.spyOn(birdhouseModel, 'count').mockResolvedValueOnce(1);

      // call the count method of the repository
      const result = await birdhouseSequelizeRepository.count(filters);

      // check if we are searching for the model using the passed filters
      expect(birdhouseModel.count).toHaveBeenCalledWith({
        where: {
          name: {
            [Op.substring]: filters.name,
          },
        },
      });

      // check if the repository returned the expected entity
      expect(result).toEqual(1);
    });
  });

  describe('create', () => {
    it('should create a new birdhouse and return the mapped entity', async () => {
      // the model instance that should be created by Sequelize
      const birdhouseModelInstance = birdhouseModel.build(birdhouseData);

      const birdhouseEntity = new Birdhouse(
        birdhouseData.id,
        birdhouseData.ubid,
        birdhouseData.name,
        birdhouseData.longitude,
        birdhouseData.latitude,
        birdhouseData.createdAt,
        birdhouseData.updatedAt,
        birdhouseData.deletedAt,
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
      ).rejects.toThrow(EntityCreateFailedException);
    });
  });

  describe('update', () => {
    it('should update an existing birdhouse and return the mapped entity', async () => {
      const filters = { id };
      const updatedBirdhouseData = { name: 'new name' };

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
        birdhouseData.createdAt,
        birdhouseData.updatedAt,
        birdhouseData.deletedAt,
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

    it('should throw a EntityNotFoundException if the birdhouse does not exist', async () => {
      const filters = { id: uuid() };
      const updatedBirdhouseData = { name: 'new name' };

      // the model instance that should be returned by Sequelize
      jest.spyOn(birdhouseModel, 'findOne').mockResolvedValue(null);

      // call the update method of the repository and assert that it throws the expected exception
      await expect(
        birdhouseSequelizeRepository.update(filters, updatedBirdhouseData),
      ).rejects.toThrow(EntityNotFoundException);
    });

    it('should throw a EntityUpdateFailedException if the model update fails', async () => {
      const filters = { id };
      const updatedBirdhouseData = { name: 'new name' };

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
      ).rejects.toThrow(EntityUpdateFailedException);
    });
  });

  describe('delete', () => {
    it('should delete an existing birdhouse', async () => {
      const filters = { id };

      // the model instance for the existing birdhouse
      const birdhouseModelInstance = birdhouseModel.build(birdhouseData);

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(birdhouseModelInstance);

      // call the delete method of the repository
      await birdhouseSequelizeRepository.delete(filters);

      // check if we are searching for the model using the id
      expect(birdhouseModel.findOne).toHaveBeenCalledWith({
        where: { id: filters.id },
      });

      // check if the model was deleted
      expect(birdhouseModelInstance.destroy).toHaveBeenCalled();
    });

    it('should throw a EntityNotFoundException if the birdhouse does not exist', async () => {
      const filters = { id: uuid() };

      // the model instance that should be returned by Sequelize
      jest.spyOn(birdhouseModel, 'findOne').mockResolvedValue(null);

      // call the delete method of the repository and assert that it throws the expected exception
      await expect(
        birdhouseSequelizeRepository.delete(filters),
      ).rejects.toThrow(EntityNotFoundException);
    });

    it('should throw a EntityDeleteFailedException if the model destroy fails', async () => {
      const id = uuid();
      const filters = { id };

      // the model instance for the existing birdhouse
      const birdhouseModelInstance = birdhouseModel.build({
        id,
        ubid: uuid(),
        name: 'name',
        longitude: 123.456,
        latitude: 789.012,
      });

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(birdhouseModelInstance);

      // the error returned by the destroy method
      jest
        .spyOn(birdhouseModelInstance, 'destroy')
        .mockRejectedValueOnce(new Error());

      // call the delete method of the repository and assert that it throws the expected exception
      await expect(
        birdhouseSequelizeRepository.delete(filters),
      ).rejects.toThrow(EntityDeleteFailedException);
    });
  });
});
