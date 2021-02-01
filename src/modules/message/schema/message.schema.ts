import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';

import * as mongoose from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, length: 255 })
  author: User;
  @Prop({ required: true, length: 255 })
  content: string;
  @Prop({ default: Date.now })
  date: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('timestamps', true);
