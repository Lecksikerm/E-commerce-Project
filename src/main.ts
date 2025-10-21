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

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  
  app.enableCors();

  app.use(bodyParser.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }));

  const port = process.env.PORT || 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Database URL: ${process.env.DATABASE_URL ? '(using connection string)' : '(using individual params)'}`);
  
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

  await app.listen(port);

  logger.log('--------- Application Started ---------');
  logger.log(`Mode: ${isDev ? 'Development' : 'Production'}`);
  logger.log(`Running on port: ${port}`);
  logger.log(`Server: ${await app.getUrl()}`);
  if (isDev) {
    logger.log(`Swagger Docs: ${await app.getUrl()}/swagger`);
  }
}

bootstrap();