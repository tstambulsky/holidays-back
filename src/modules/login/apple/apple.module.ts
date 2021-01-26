import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppleService } from './apple.service';
import { UsersModule } from '../../users/users.module';


@Module({
  imports: [UsersModule],
  providers: [AppleService]
})
export class AppleModule {}
