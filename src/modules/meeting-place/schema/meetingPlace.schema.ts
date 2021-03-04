import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MeetingDocument = Meeting & mongoose.Document;

@Schema({ timestamps: true })
export class Meeting {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  description: string;

  @Prop()
  photo: string;

  @Prop({ default: true })
  active: boolean;
}

export const MeetingPlaceSchema = SchemaFactory.createForClass(Meeting);

MeetingPlaceSchema.index({ location: '2dsphere' });
