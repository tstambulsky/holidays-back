import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type CountryDocument = Country & mongoose.Document;

@Schema()
export class Country {
  @Prop({ required: true })
  name: string;
  @Prop({ default: true })
  active: boolean;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

CountrySchema.set('timestamps', true);
