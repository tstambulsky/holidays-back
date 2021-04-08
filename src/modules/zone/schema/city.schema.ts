import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { State } from './state.schema';

import * as mongoose from 'mongoose';

export type CityDocument = City & mongoose.Document;

@Schema()
export class City {
  @Prop({ required: false, unique: true })
  postalCode: number;
  @Prop({ type: String })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({})
  state: string;
  @Prop({ default: true })
  active: boolean;
}
export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.set('timestamps', true);
