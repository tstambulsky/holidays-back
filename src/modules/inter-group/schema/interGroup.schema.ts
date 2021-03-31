import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Group } from '../../group/schema/group.schema';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';

import * as mongoose from 'mongoose';

export type InterGroupDocument = InterGroup & mongoose.Document;

@Schema({ timestamps: true })
export class InterGroup {
  @Prop()
  name: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Group' })
  groupSender: Group;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Group' })
  groupReceiver: Group;

  @Prop()
  startDate: Date;

  @Prop({ required: false })
  endDate: Date;

  @Prop({})
  tipeOfActivity: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: Meeting;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: Meeting;

  @Prop({ default: false })
  active: boolean;

  @Prop({ default: false })
  confirmed: boolean;
}
export const InterGroupSchema = SchemaFactory.createForClass(InterGroup);
