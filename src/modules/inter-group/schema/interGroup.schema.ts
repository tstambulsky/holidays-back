import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type InterGroupDocument = InterGroup & mongoose.Document;

@Schema({ timestamps: true })
export class InterGroup {
  @Prop([{ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Group' }])
  groupOne: mongoose.Types.ObjectId;
  @Prop([{ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Group' }])
  groupTwo: mongoose.Types.ObjectId;
  @Prop({ required: true, default: Date.now })
  startDate: Date;
  @Prop()
  endDate?: Date;
  @Prop({ required: true })
  tipeOfActivity: string;
  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: mongoose.Types.ObjectId;
  @Prop({ default: true })
  active: boolean;
}
export const InterGroupSchema = SchemaFactory.createForClass(InterGroup);
