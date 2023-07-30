import { v4 as uuid } from 'uuid';
import { UnauthorizedException } from '../exceptions';
import { CanManipulateGuard } from './can-manipulate.guard';

describe('CanManipulateGuard', () => {
  let guard: CanManipulateGuard;

  beforeEach(async () => {
    guard = new CanManipulateGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if id in ids', async () => {
      const id = uuid();

      const mockRequest = {
        params: { id },
        housesIds: [id, uuid()],
      };

      const result = await guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as any);

      expect(result).toBe(true);
    });

    it('should throw an UnauthorizedException if id is not in allowed ids', async () => {
      const mockRequest = {
        params: { id: uuid() },
        housesIds: [uuid(), uuid()],
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
