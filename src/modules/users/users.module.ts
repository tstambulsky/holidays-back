import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),EmailModule, CloudinaryModule, 
  forwardRef(() => NotificationModule),],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService]
})
export class UsersModule {}
