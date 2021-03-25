import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalConfig } from './config/global';
import { Logger } from '@nestjs/common';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({limit: '50mb'}));
  app.use(urlencoded({limit: '50mb', 
  parameterLimit: 100000,
  extended: true}))
  //app.setGlobalPrefix('/api');
  await app.listen(globalConfig.port, () => logger.log(`Server started on port ${globalConfig.port}`));
}

bootstrap();
