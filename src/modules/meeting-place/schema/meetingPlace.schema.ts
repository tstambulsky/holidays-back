import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type MeetingDocument = Meeting & mongoose.Document

@Schema({ timestamps: true })
export class Meeting {
   @Prop({ required: true })
   name: string
   @Prop()
   address: string
   @Prop({ type: [Number], required: true }) //[Long - Lat]
   location: string
   @Prop({ required: true })
   description: string
   @Prop()
   photo: [string]
}

export const MeetingPlaceSchema = SchemaFactory.createForClass(Meeting)

MeetingPlaceSchema.index({ location: '2dsphere' })
