import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type GroupDocument = Group & mongoose.Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({})
  name: string;
  @Prop({  default: Date.now })
  startDate: Date;
  @Prop({ default: Date.now })
  startTime: Date;
  @Prop()
  endTime?: Date;
  @Prop()
  typeOfActivity: string;
  @Prop([{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }])
  integrants: mongoose.Types.ObjectId[];
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: mongoose.Types.ObjectId;
  @Prop({})
  description: string;
  @Prop({ type: [String], required: false })
  photos?: string;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
