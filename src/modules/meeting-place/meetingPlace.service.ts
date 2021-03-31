import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from './schema/meetingPlace.schema';
import { MeetingDTO, UpdateMeetingDTO } from './dto/meeting.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { removeImage } from '../users/utils/deleteImage';

@Injectable()
export class MeetingPlaceService {
  constructor(@InjectModel(Meeting.name) private readonly meetingModel: Model<MeetingDocument>,
  private readonly _cloudinaryService: CloudinaryService) {}

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
      return meeting;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createMeeting(meetingDTO: MeetingDTO): Promise<Meeting> {
    try {
      const meeting = new this.meetingModel(meetingDTO);
      const place = await meeting.save();
      return place;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateMeeting(meetingID: any, data: UpdateMeetingDTO): Promise<Meeting | undefined> {
    try {
      const meeting = await this.meetingModel.findOne({ _id: meetingID });
      await meeting.updateOne({ ...data });
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

  async toInactiveMeeting(meetingID: any): Promise<string> {
    try {
      const meeting = await this.meetingModel.findById(meetingID);
      if (!meeting) {
        throw new HttpException('Not Found', 404);
      }
      meeting.active = false;
      await meeting.save();
      return 'Meeting change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async setMeetingPhoto(meetingId: any, file: any, url: any){
     try {
       const meeting = await this.meetingModel.findOne({_id: meetingId});
       await meeting.updateOne({ photo: url });
       await removeImage(file.path);
       return meeting;
     } catch (error) {
       throw new Error(error.message)
     }
    }

     async updatePhotos(meetingId: any, files: any) {
      try {
        for await(let file of files){
        const data = await this._cloudinaryService.upload(file.path)
        const meeting = await this.meetingModel.findOne({_id: meetingId});
        meeting.photos.push({photoUrl: data.url, public_id: file.filename});
        await meeting.save();
        await removeImage(file.path);
      }
    } catch (error) {
        throw new Error(error.message)
      }
    }

}
