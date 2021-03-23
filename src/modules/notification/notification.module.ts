import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationSchema } from './schema/notification.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), 
UsersModule],
  providers: [NotificationService],
  controllers: [],
  exports: [NotificationService]
})
export class NotificationModule {}
