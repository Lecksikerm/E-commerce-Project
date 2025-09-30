// Polyfill for global crypto if missing (Node.js <18)
if (typeof globalThis.crypto === 'undefined') {
  // Use Node's webcrypto API if available (Node 15+)
  // Fallback to legacy crypto if needed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cryptoModule = require('crypto');
  globalThis.crypto = cryptoModule.webcrypto || cryptoModule;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 app.use(bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();  
    },
  }));    
  const logger = new Logger('Bootstrap');

  const projectName = 'e-commerce';
  const port = process.env.PORT || 8000;


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

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

  await app.listen(port);

  logger.log('--------- Application Started ---------');
  logger.log(`Listening on http://localhost:${port}`);
  logger.log(`Swagger Docs available at http://localhost:${port}/swagger`);
}

bootstrap();
