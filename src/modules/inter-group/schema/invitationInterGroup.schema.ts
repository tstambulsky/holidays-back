import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';
import * as mongoose from 'mongoose';
import { Group } from '../../group/schema/group.schema';

@Schema({ timestamps: true })
export class InvitationInterGroup {
  @Prop({ default: Date.now })
  created: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminSender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupSender: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminReceiver: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupReceiver: Group;

  @Prop({ default: false })
  success: boolean;

  @Prop({ default: true })
  active: boolean;
}

export type InvitationInterGroupDocument = InvitationInterGroup & mongoose.Document;
export const InvitationInterGroupSchema = SchemaFactory.createForClass(InvitationInterGroup);