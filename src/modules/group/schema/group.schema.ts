import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserSchema, User } from '../../users/schema/users.schema';
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
  @Prop([{ type: UserSchema }])
  integrants: User;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceOne: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  meetingPlaceTwo?: mongoose.Types.ObjectId;
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
