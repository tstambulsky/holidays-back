import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalConfig } from './config/global';
import { Logger } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  const app = await NestFactory.create(AppModule);
  app.use('/api/users/search/contacts', json({ limit: '50mb' }));
  app.use('/api/group/groups/contacts', json({ limit: '50mb' }));
  app.use(json({limit: '100kb'}))
  app.enableCors();
  //app.setGlobalPrefix('/api');
  await app.listen(globalConfig.port, () => logger.log(`Server started on port ${globalConfig.port}`));
}

bootstrap();
