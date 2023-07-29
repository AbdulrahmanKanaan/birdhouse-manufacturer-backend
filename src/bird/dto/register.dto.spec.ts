import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe.only('RegisterDto', () => {
  it('should be a valid dto', async () => {
    const dto = new RegisterDto();
    dto.name = 'abcd';
    dto.longitude = 12.34;
    dto.latitude = 56.78;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should has name with length longer than 4', async () => {
    const dto = new RegisterDto();
    dto.name = 'ab';
    dto.longitude = 12.34;
    dto.latitude = 56.78;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toEqual({
      isLength: 'name must be longer than or equal to 4 characters',
    });
  });

  it('should has name with length less than 16', async () => {
    const dto = new RegisterDto();
    dto.name = 'abcdefghijklmnopqrsttuvwxyz';
    dto.longitude = 12.34;
    dto.latitude = 56.78;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toEqual({
      isLength: 'name must be shorter than or equal to 16 characters',
    });
  });
});
