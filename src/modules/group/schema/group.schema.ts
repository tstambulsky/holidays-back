import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';

import * as mongoose from 'mongoose';

export type GroupDocument = Group & mongoose.Document;

@Schema()
export class Group {
  @Prop({ default: true })
  name: string;
  @Prop({ required: true, default: Date.now })
  startDate: Date;
  @Prop({ required: true, default: Date.now })
  startTime: Date;
  @Prop()
  endTime?: Date;
  @Prop({ required: true })
  typeOfActivity: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: Meeting;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: Meeting;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [String], required: false })
  photos?: string;
}
export const GroupSchema = SchemaFactory.createForClass(Group);

GroupSchema.set('timestamps', true);
