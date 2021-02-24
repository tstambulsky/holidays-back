import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { MessageSchema } from './message.schema'
import { UserSchema } from '../../users/schema/users.schema'

export type RoomDocument = Room & mongoose.Document

@Schema({ timestamps: true })
export class Room {
   @Prop({ type: String })
   name: string
   @Prop({ type: String })
   description: string
   @Prop({ type: Boolean, default: false })
   is_user: boolean
   @Prop({ type: Boolean, default: false })
   is_private: boolean
   @Prop({ type: [UserSchema] })
   users: any
   @Prop({ type: [MessageSchema] })
   messages: any
}
export const RoomSchema = SchemaFactory.createForClass(Room)
