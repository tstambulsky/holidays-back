import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import * as mongoose from 'mongoose'

export type CityDocument = City & mongoose.Document

@Schema({ timestamps: true })
export class City {
   @Prop({ required: true })
   postalCode: number
   @Prop({ required: true })
   name: string
   @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'State', required: true, autopopulate: true })
   state: mongoose.Types.ObjectId
   @Prop({ default: true })
   active: boolean
}
export const CitySchema = SchemaFactory.createForClass(City)
