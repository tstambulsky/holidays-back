import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '../../users/schema/users.schema';
import { Chat } from './chat.schema';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Chat' })
  chat: Chat;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User', length: 255, autopopulate: true })
  author: User;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true, length: 255 })
  content: string;

  @Prop({ default: Date.now })
  date: Date;
}

export type MessageDocument = Message & mongoose.Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
