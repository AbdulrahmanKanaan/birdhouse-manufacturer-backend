import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { BirdhouseRepository } from '&/domain/repositories';
import { v4 as uuid } from 'uuid';
import { Birdhouse } from '&/domain/entities';
import { UnauthorizedException } from '../exceptions';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let birdhouseRepo: BirdhouseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: BirdhouseRepository, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    birdhouseRepo = module.get<BirdhouseRepository>(BirdhouseRepository);

    guard = new AuthGuard(birdhouseRepo);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if all ubids are valid', async () => {
      const [id1, id2] = [uuid(), uuid()];

      const mockRequest = {
        headers: { 'x-ubid': `${id1},${id2}` },
      };

      const mockBirdhouses = [{ id: id1 }, { id: id2 }] as Birdhouse[];

      jest
        .spyOn(birdhouseRepo, 'findAll')
        .mockResolvedValueOnce(mockBirdhouses);

      const result = await guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as any);

      expect(result).toBe(true);
    });

    it('should throw an UnauthorizedException if ubid is invalid', async () => {
      const [id1, id2] = [uuid(), uuid()];

      const mockRequest = {
        headers: { 'x-ubid': `${id1}` },
      };

      const mockBirdhouses = [{ id: id1 }, { id: id2 }] as Birdhouse[];

      jest
        .spyOn(birdhouseRepo, 'findAll')
        .mockResolvedValueOnce(mockBirdhouses);

      await expect(
        guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as any),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw an UnauthorizedException if ubid is not present', async () => {
      const mockRequest = {
        headers: {},
      };

      await expect(
        guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as any),
      ).rejects.toThrow(new UnauthorizedException());
    });
  });
});
