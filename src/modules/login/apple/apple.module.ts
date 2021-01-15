import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Apple, UserAppleSchema } from './schema/apple.schema';
import { AppleService } from './apple.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Apple.name, schema: UserAppleSchema }])],
  providers: [AppleService]
})
export class AppleModule {}
