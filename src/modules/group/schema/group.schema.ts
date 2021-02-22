import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import * as mongoose from 'mongoose';

export type GroupDocument = Group & mongoose.Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({})
  name: string;
  @Prop({ default: Date.now })
  startDate: Date;
  @Prop()
  startTime: string;
  @Prop()
  endTime?: string;
  @Prop()
  typeOfActivity: string;
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  integrants: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: Meeting;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: Meeting;
  @Prop({})
  address: [
    {
      streetAndNumber: string;
      lat: string;
      long: string;
    }
  ];
  @Prop({})
  description: string;
  @Prop({ type: [String], required: false })
  photos?: string;
  @Prop({ default: true })
  active: boolean;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
