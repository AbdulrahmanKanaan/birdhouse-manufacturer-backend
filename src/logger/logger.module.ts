import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from './logger.service';

const onlyBirdActions = winston.format((info) => {
  if (info.context !== 'BIRD ACTION') {
    return false;
  }
  return info;
});

@Module({
  providers: [LoggerService],
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs.log',
          level: 'info',
        }),
        new winston.transports.File({
          filename: 'actions.log',
          level: 'info',
          format: onlyBirdActions(),
        }),
      ],
    }),
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
