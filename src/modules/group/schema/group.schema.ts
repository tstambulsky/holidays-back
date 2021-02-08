import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type GroupDocument = Group & mongoose.Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ default: true })
  name: string;
  @Prop({ required: true, default: Date.now })
  startDate: Date;
  @Prop({ required: true, default: Date.now })
  startTime: Date;
  @Prop()
  endTime?: Date;
  @Prop()
  typeOfActivity: string;
  @Prop([{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }])
  integrants: mongoose.Types.ObjectId[];
  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: mongoose.Types.ObjectId;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [String], required: false })
  photos?: string;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
