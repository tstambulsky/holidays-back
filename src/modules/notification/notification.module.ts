import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationSchema } from './schema/notification.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), 
forwardRef(() => UsersModule)],
  providers: [NotificationService],
  controllers: [],
  exports: [NotificationService]
})
export class NotificationModule {}
