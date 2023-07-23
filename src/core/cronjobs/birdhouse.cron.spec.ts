import { Test, TestingModule } from '@nestjs/testing';
import { BirdhouseCron } from './birdhouse.cron';

describe('BirdhouseCron', () => {
  let service: BirdhouseCron;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BirdhouseCron],
    }).compile();

    service = module.get<BirdhouseCron>(BirdhouseCron);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
