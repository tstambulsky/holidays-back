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

  @Prop({ type: [{}], required: false, minItems: 0, maxItems: 6 })
  photos: [{
    photoUrl: String,
    public_id: String
  }
]

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  isStore: boolean;

}

export const MeetingPlaceSchema = SchemaFactory.createForClass(Meeting);

MeetingPlaceSchema.index({ location: '2dsphere' });
