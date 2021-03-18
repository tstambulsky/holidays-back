import { Module } from '@nestjs/common';
import { MeetingPlaceService } from './meetingPlace.service';
import { MeetingPlaceController } from './meetingPlace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meeting, MeetingPlaceSchema } from './schema/meetingPlace.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingPlaceSchema }]), CloudinaryModule],
  controllers: [MeetingPlaceController],
  providers: [MeetingPlaceService],
  exports: [MeetingPlaceService]
})
export class MeetingPlaceModule {}
