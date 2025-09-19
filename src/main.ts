// Polyfill for global crypto if missing (Node.js v18+ should have it)
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
