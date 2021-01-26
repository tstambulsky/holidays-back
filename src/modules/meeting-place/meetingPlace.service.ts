import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from './schema/meetingPlace.schema';
import { MeetingDTO, UpdateMeetingDTO } from './dto/meeting.dto';

@Injectable()
export class MeetingPlaceService {
  constructor(@InjectModel(Meeting.name) private readonly meetingModel: Model<MeetingDocument>) {}

  async getAll(): Promise<Meeting[]> {
    const meetings = await this.meetingModel.find();
    if (!meetings) {
      throw new HttpException('Not Found', 404);
    }
    return meetings;
  }

  async getMeeting(meetingID: any): Promise<Meeting> {
    try {
      const meeting = await this.meetingModel.findOne({ _id: meetingID });
      console.log(meeting);
      return meeting;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createMeeting(meetingDTO: MeetingDTO): Promise<string> {
    try {
      const meeting = await new this.meetingModel(meetingDTO);
      await meeting.save();
      return 'Meeting place created';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateMeeting(meetingID: any, data: UpdateMeetingDTO): Promise<Meeting | undefined> {
    try {
      const meeting = await this.meetingModel.findOne({ _id: meetingID });
      const updatedMeeting = await meeting.updateOne({ ...data });
      const meetingUpdated = await this.meetingModel.findOne({ _id: meetingID });
      return meetingUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteMeeting(meetingID: any): Promise<string> {
    try {
      await this.meetingModel.deleteOne({ _id: meetingID });
      return 'Meeting place deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
