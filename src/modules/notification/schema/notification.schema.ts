import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schema/users.schema';

@Schema({ timestamps: true })
export class Notification {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  to: User;

  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({ default: false })
  message: boolean;
}

export type NotificationDocument = Notification & mongoose.Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
