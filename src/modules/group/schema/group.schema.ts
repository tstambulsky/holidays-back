import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { TypeOfActivity } from '../../typeOfActivity/schema/typeOfActivity.schema';
import * as mongoose from 'mongoose';

export type GroupDocument = Group & mongoose.Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({})
  name: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TypeOfActivity' })
  typeOfActivity: TypeOfActivity;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  integrants: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: Meeting;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: Meeting;

  @Prop({})
  description: string;

  @Prop({ type: [String], required: false })
  photos?: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  admin: User;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
