import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  to: string;

  @Prop()
  title: string;

  @Prop()
  body: string;
}

export type NotificationDocument = Notification & mongoose.Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
