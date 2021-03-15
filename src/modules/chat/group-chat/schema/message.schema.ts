import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../../users/schema/users.schema';
import { Group } from '../../../group/schema/group.schema';
import { InterGroup } from '../../../inter-group/schema/interGroup.schema';

import * as mongoose from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true, length: 255, autopopulate: true })
  author: mongoose.Types.ObjectId;
  @Prop({ required: true, length: 255 })
  content: string;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Group'})
  group: Group;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'InterGroup'})
  interGroup: InterGroup;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User'})
  adminUser: User
  @Prop({ default: Date.now })
  date: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
