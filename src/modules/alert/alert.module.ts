import { Module } from '@nestjs/common';
import { AlertGateway } from './alert.gateway';
import { AlertController } from './alert.controller';

@Module({
  controllers: [AlertController],
  providers: [AlertGateway]
})
export class AlertModule {}
