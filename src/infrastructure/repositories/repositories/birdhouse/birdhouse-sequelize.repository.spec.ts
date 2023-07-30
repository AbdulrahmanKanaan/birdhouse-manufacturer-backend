import {
  BirdhouseModel,
  ResidencyModel,
} from '&/infrastructure/repositories/models';
import { Birdhouse } from '&/domain/entities';
import { BirdhouseMapper } from '&/domain/mappers';
import {
  EntityNotFoundException,
  EntityValidationException,
  RepositoryException,
} from '&/domain/repositories/exceptions';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Op, ValidationError } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { BirdhouseSequelizeRepository } from './birdhouse-sequelize.repository';

describe('BirdhouseSequelizeRepository', () => {
  let repo: BirdhouseSequelizeRepository;
  let birdhouseModel: typeof BirdhouseModel;
  let residencyModel: typeof ResidencyModel;

  let id: string;
  let ubid: string;
  let birdhouseData: any;
  let birdhouseEntity: Birdhouse;
  let birdhouseModelInstance: BirdhouseModel;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BirdhouseSequelizeRepository,
        {
          provide: BirdhouseMapper,
          useValue: {
            toModel: jest.fn(() => birdhouseModelInstance),
            toEntity: jest.fn(() => birdhouseEntity),
          },
        },
        {
          provide: getModelToken(BirdhouseModel),
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
            destroy: jest.fn(),
          },
        },
        { provide: getModelToken(ResidencyModel), useValue: {} },
      ],
    }).compile();

    repo = moduleRef.get(BirdhouseSequelizeRepository);
    birdhouseModel = moduleRef.get(getModelToken(BirdhouseModel));
    residencyModel = moduleRef.get(getModelToken(ResidencyModel));

    id = uuid();
    ubid = uuid();
    birdhouseData = {
      id: id,
      ubid: ubid,
      name: 'name',
      longitude: 123.45,
      latitude: 678.09,
      residencyId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    birdhouseEntity = new Birdhouse(
      birdhouseData.id,
      birdhouseData.ubid,
      birdhouseData.name,
      birdhouseData.longitude,
      birdhouseData.latitude,
      birdhouseData.residencyId,
      birdhouseData.createdAt,
      birdhouseData.updatedAt,
      birdhouseData.deletedAt,
    );

    birdhouseModelInstance = {
      ...birdhouseData,
      save: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };
  });

  describe('findById', () => {
    it('should return the birdhouse with the passed id', async () => {
      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(birdhouseModelInstance as BirdhouseModel);

      // call the findById method of the repository
      const result = await repo.findOne(
        { id: birdhouseData.id },
        { relations: { residency: true } },
      );

      // check if we are searching for the model using the id & if we are including the residency
      expect(birdhouseModel.findOne).toHaveBeenCalledWith({
        where: { id },
        include: [{ model: residencyModel, as: 'residency' }],
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
      const result = await repo.findOne({ id });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all birdhouses that match the passed filters', async () => {
      const filters = { name: 'name' };
      const options = {
        limit: 10,
        skip: 0,
        relations: { residency: true },
        order: { by: 'createdAt', direction: 'ASC' as const },
      };

      // the model instance returned by the findAll method
      jest
        .spyOn(birdhouseModel, 'findAll')
        .mockResolvedValueOnce([birdhouseModelInstance as BirdhouseModel]);

      // call the findAll method of the repository
      const result = await repo.findAll(filters, options);

      // check if we are searching for the model using the passed filters
      expect(birdhouseModel.findAll).toHaveBeenCalledWith({
        where: {
          name: {
            [Op.substring]: filters.name,
          },
        },
        include: [{ model: residencyModel, as: 'residency' }],
        limit: options.limit,
        offset: options.skip,
        order: [['createdAt', 'ASC']],
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
      const result = await repo.count(filters);

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
      // the returned instance when saving data using the model
      jest
        .spyOn(birdhouseModelInstance, 'save')
        .mockResolvedValueOnce(birdhouseModelInstance as BirdhouseModel);

      // call the create method of the repository
      const result = await repo.create(birdhouseData);

      // assert that the model instance was saved
      expect(birdhouseModelInstance.save).toHaveBeenCalled();

      // assert that the repository returned the expected entity
      expect(result).toEqual(birdhouseEntity);
    });

    it('should throw a EntityValidationException if the model save threw ValidationError', async () => {
      // the error returned when saving data using the model
      jest
        .spyOn(birdhouseModelInstance, 'save')
        .mockRejectedValueOnce(new ValidationError('', []));

      // call the create method of the repository and assert that it throws the expected exception
      await expect(repo.create(birdhouseData)).rejects.toThrow(
        new EntityValidationException({ entity: birdhouseData }),
      );
    });

    it('should throw a EntityValidationException if the model save threw ValidationError', async () => {
      // the error returned when saving data using the model
      jest
        .spyOn(birdhouseModelInstance, 'save')
        .mockRejectedValueOnce(new Error());

      // call the create method of the repository and assert that it throws the expected exception
      await expect(repo.create(birdhouseData)).rejects.toThrow(
        new RepositoryException(),
      );
    });
  });

  describe('update', () => {
    it('should update an existing birdhouse and return the mapped entity', async () => {
      const filters = { id };
      const newData = { name: 'new name' };

      // the model instance for the existing birdhouse
      const oldBirdhouseModelInstance = {
        ...birdhouseModelInstance,
      } as BirdhouseModel;

      // the model instance for the updated birdhouse
      const updatedBirdhouseModelInstance = {
        ...birdhouseModelInstance,
        ...newData,
      } as BirdhouseModel;

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(oldBirdhouseModelInstance);

      // the model instance returned by the update method
      jest
        .spyOn(oldBirdhouseModelInstance, 'update')
        .mockResolvedValueOnce(updatedBirdhouseModelInstance);

      // call the update method of the repository
      const result = await repo.update(filters, newData);
      // update mocked entity
      birdhouseEntity.name = newData.name;

      // check if we are searching for the model using the id
      expect(birdhouseModel.findOne).toHaveBeenCalledWith({
        where: { id: filters.id },
      });

      // check if the model was updated using the passed data
      expect(oldBirdhouseModelInstance.update).toHaveBeenCalledWith(newData);

      // check if the repository returned the expected entity
      expect(result).toEqual(birdhouseEntity);
      expect(result).toBeInstanceOf(Birdhouse);
    });

    it('should throw a EntityNotFoundException if the birdhouse does not exist', async () => {
      const filters = { id: uuid() };

      // the model instance that should be returned by Sequelize
      jest.spyOn(birdhouseModel, 'findOne').mockResolvedValue(null);

      // call the update method of the repository and assert that it throws the expected exception
      await expect(repo.update(filters, { name: 'new name' })).rejects.toThrow(
        new EntityNotFoundException({ id: filters.id }),
      );
    });

    it('should throw a EntityValidationException if the model update fails because of validation error', async () => {
      const filters = { id };
      const updatedBirdhouseData = { name: 'new name' };

      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(birdhouseModelInstance);

      // the error returned by the update method
      jest
        .spyOn(birdhouseModelInstance, 'update')
        .mockRejectedValueOnce(new ValidationError('', []));

      // call the update method of the repository and assert that it throws the expected exception
      await expect(repo.update(filters, updatedBirdhouseData)).rejects.toThrow(
        new EntityValidationException({ entity: updatedBirdhouseData }),
      );
    });

    it('should throw a RepositoryError if the model update fails', async () => {
      // the model instance returned by the findOne method
      jest
        .spyOn(birdhouseModel, 'findOne')
        .mockResolvedValueOnce(birdhouseModelInstance);

      // the error returned by the update method
      jest
        .spyOn(birdhouseModelInstance, 'update')
        .mockRejectedValueOnce(new Error());

      // call the update method of the repository and assert that it throws the expected exception
      await expect(repo.update({ id: '' }, {})).rejects.toThrow(
        new RepositoryException({ message: 'Update failed' }),
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing birdhouse', async () => {
      const filters = { id };

      jest.spyOn(birdhouseModel, 'destroy').mockResolvedValueOnce(1);

      // call the delete method of the repository
      await repo.delete(filters);

      // check if the model was deleted
      expect(birdhouseModel.destroy).toHaveBeenCalled();

      // check if it's called with correct filters
      expect(birdhouseModel.destroy).toHaveBeenCalledWith({
        where: { id: { [Op.in]: [filters.id] } },
      });
    });

    it('should throw a RepositoryException if the birdhouse does not exist', async () => {
      const filters = { id: uuid() };

      // the model instance that should be returned by Sequelize
      jest.spyOn(birdhouseModel, 'destroy').mockRejectedValueOnce(new Error());

      // call the delete method of the repository and assert that it throws the expected exception
      await expect(repo.delete(filters)).rejects.toThrow(
        new RepositoryException(),
      );
    });
  });

  describe('getOutdatedBirdhouses', () => {
    it('should return an array of outdated birdhouses', async () => {
      const date = new Date();

      jest
        .spyOn(birdhouseModel, 'findAll')
        .mockResolvedValueOnce([birdhouseModelInstance]);

      const result = await repo.getOutdatedBirdhouses(date);

      expect(birdhouseModel.findAll).toHaveBeenCalled();
      expect(birdhouseModel.findAll).toHaveBeenCalledWith({
        where: {
          updatedAt: {
            [Op.lt]: date,
          },
        },
        include: [
          {
            model: residencyModel,
            as: 'residency',
            where: {
              createdAt: {
                [Op.lt]: date,
              },
            },
          },
        ],
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Birdhouse);
    });
  });
});
