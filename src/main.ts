import * as dotenv from 'dotenv';
dotenv.config();

// Polyfill for global crypto
import { webcrypto } from 'node:crypto';
if (!global.crypto) {
  global.crypto = webcrypto;
}

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

let server: any;
const isDev = !process.env.VERCEL;

async function createApp() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  if (isDev) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('E-Commerce API')
      .setDescription('API documentation for the e-commerce project')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'user-token',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'admin-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  return app;
}

if (process.env.VERCEL !== 'true') {
  (async () => {
    const app = await createApp();
    const port = process.env.PORT || 3000;
    await app.listen(port);
    const logger = new Logger('Bootstrap');
    logger.log(`Server running on http://localhost:${port}`);
    logger.log(`Swagger enabled? ${isDev}`);

  })();
}

export default async function handler(req: any, res: any) {
  if (!server) {
    const app = await createApp();
    await app.init();
    server = app.getHttpAdapter().getInstance();
  }
  return server(req, res);
}

