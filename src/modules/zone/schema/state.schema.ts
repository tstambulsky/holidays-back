import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type StateDocument = State & mongoose.Document;

@Schema({ timestamps: true })
export class State {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Country', required: true, autopopulate: true })
  country: mongoose.Types.ObjectId;
  @Prop({ default: true })
  active: boolean;
}

export const StateSchema = SchemaFactory.createForClass(State);
