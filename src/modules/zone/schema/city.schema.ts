import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { State } from './state.schema';

import * as mongoose from 'mongoose';

export type CityDocument = City & mongoose.Document;

@Schema()
export class City {
  @Prop({ required: true })
  postalCode: number;
  @Prop({ required: true })
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'State' })
  State: State;
  @Prop({ default: true })
  active: boolean;
}
{
  timestamps: true;
}
export const CitySchema = SchemaFactory.createForClass(City);
