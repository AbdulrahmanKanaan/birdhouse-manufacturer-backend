import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;

  app.enableCors({ origin: '*' });

  const loggerService = await app.resolve<LoggerService>(LoggerService);

  app.useLogger(loggerService);

  await app.listen(PORT);
}
bootstrap();
