import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';
import { Group } from '../../group/schema/group.schema';
import { InterGroup } from '../../inter-group/schema/interGroup.schema';

import * as mongoose from 'mongoose';
import { Invitation } from 'src/modules/group/schema/invitation.schema';

export type ChatDocument = Chat & mongoose.Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  name: string;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Group'})
  group: Group;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'InterGroup'})
  interGroup: InterGroup;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Invitation' })
  invitation: Invitation;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User'})
  adminUser: User;
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User'})
  user: User;
  @Prop({ default: false})
  pending: boolean;
  @Prop({ default: false})
  place: boolean;
  @Prop({ default: false})
  setTimeAndPlace: boolean;
  @Prop({ default: Date.now})
  date: Date
  @Prop()
  image: string;
  @Prop({ default: true })
  active: boolean;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
