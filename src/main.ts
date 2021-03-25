import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalConfig } from './config/global';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', 
  parameterLimit: 100000,
  extended: true}))
  //app.setGlobalPrefix('/api');
  await app.listen(globalConfig.port, () => logger.log(`Server started on port ${globalConfig.port}`));
}

bootstrap();
