import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true, length: 255, autopopulate: true })
  author: mongoose.Types.ObjectId;
  @Prop({ required: true, length: 255 })
  content: string;
  @Prop({ default: Date.now })
  date: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
