import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { State } from './state.schema';

import * as mongoose from 'mongoose';

export type CityDocument = City & mongoose.Document;

@Schema()
export class City {
  @Prop({ required: true, unique: true })
  postalCode: number;
  @Prop({ required: true })
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true })
  state: State;
  @Prop({ default: true })
  active: boolean;
}
export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.set('timestamps', true);
