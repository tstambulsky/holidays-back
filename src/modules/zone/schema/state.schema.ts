import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Country } from './country.schema';

import * as mongoose from 'mongoose';

export type StateDocument = State & mongoose.Document;

@Schema()
export class State {
  @Prop({ required: true })
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true })
  country: Country;
  @Prop({ default: true })
  active: boolean;
}
{
  timestamps: true;
}
export const StateSchema = SchemaFactory.createForClass(State);
