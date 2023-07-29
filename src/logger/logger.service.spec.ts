import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService as BaseLoggerService } from '@nestjs/common';

describe('LoggerService', () => {
  let service: LoggerService;
  let winstonMock: BaseLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<LoggerService>(LoggerService);
    winstonMock = await module.resolve<BaseLoggerService>(
      WINSTON_MODULE_NEST_PROVIDER,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should call logger.log', () => {
      const mockMessage = 'test message';
      const mockContext = 'test context';

      service.log(mockMessage, mockContext);

      expect(winstonMock.log).toHaveBeenCalledWith(mockMessage, mockContext);
    });
  });

  describe('error', () => {
    it('should call logger.error', () => {
      const mockMessage = 'test message';
      const mockStack = 'test stack';
      const mockContext = 'test context';

      service.error(mockMessage, mockStack, mockContext);

      expect(winstonMock.error).toHaveBeenCalledWith(
        mockMessage,
        mockStack,
        mockContext,
      );
    });
  });

  describe('warn', () => {
    it('should call logger.warn', () => {
      const mockMessage = 'test message';
      const mockContext = 'test context';

      service.warn(mockMessage, mockContext);

      expect(winstonMock.warn).toHaveBeenCalledWith(mockMessage, mockContext);
    });
  });
});
