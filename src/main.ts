import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { globalConfig } from './config/global'
import { Logger } from '@nestjs/common'

async function bootstrap() {
   const logger: Logger = new Logger('main.ts')
   const app = await NestFactory.create(AppModule)
   app.enableCors()
   await app.listen(globalConfig.port, () => logger.log(`Server started on port ${globalConfig.port}`))
}

bootstrap()
