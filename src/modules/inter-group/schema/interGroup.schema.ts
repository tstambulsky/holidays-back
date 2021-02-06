import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Group } from '../../group/schema/group.schema';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';

import * as mongoose from 'mongoose';

export type InterGroupDocument = InterGroup & mongoose.Document;

@Schema()
export class InterGroup {
  @Prop([{ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Group' }])
  groupOne: Group;
  @Prop([{ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Group' }])
  groupTwo: Group;
  @Prop({ required: true, default: Date.now })
  startDate: Date;
  @Prop()
  endDate?: Date;
  @Prop({ required: true })
  tipeOfActivity: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: Meeting;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: Meeting;
  @Prop({ default: true })
  active: boolean;
}
export const InterGroupSchema = SchemaFactory.createForClass(InterGroup);

InterGroupSchema.set('timestamps', true);
