import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './domain/services';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Config
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;

  // CORS
  app.enableCors({ origin: '*' });

  // Logging
  const loggerService = await app.resolve<LoggerService>(LoggerService);
  app.useLogger(loggerService);

  // API Docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Birdhouse Manufacturer')
    .setDescription('birdhouse manufacturer api documentation')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
