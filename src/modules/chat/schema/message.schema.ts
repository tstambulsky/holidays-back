import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';
import { Chat } from './chat.schema';

import * as mongoose from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Chat'})
  chat: Chat
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true, length: 255, autopopulate: true })
  author: User;
  @Prop({ required: true, length: 255 })
  content: string;
  @Prop({ default: Date.now })
  date: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
