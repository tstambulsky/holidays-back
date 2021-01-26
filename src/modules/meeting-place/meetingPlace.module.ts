import { Module } from '@nestjs/common';
import { MeetingPlaceService } from './meetingPlace.service';
import { MeetingPlaceController } from './meetingPlace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meeting, MeetingPlaceSchema } from './schema/meetingPlace.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingPlaceSchema }])],
  controllers: [MeetingPlaceController],
  providers: [MeetingPlaceService],
  exports: [MeetingPlaceService]
})
export class MeetingPlaceModule {}
