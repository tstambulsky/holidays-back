import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '../../users/schema/users.schema';
import { Group } from '../../group/schema/group.schema';
import { InterGroup } from '../../inter-group/schema/interGroup.schema';
import { Invitation } from '../../group/schema/invitation.schema';
import { Proposal } from 'src/modules/inter-group/schema/proposal.schema';
import { Meeting } from 'src/modules/meeting-place/schema/meetingPlace.schema';
import { Message } from './message.schema';

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  name: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Group' })
  group: Group;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'InterGroup' })
  interGroup: InterGroup;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Invitation' })
  invitation: Invitation;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Proposal' })
  proposal: Proposal;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  adminUser: User;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  user: User;

  @Prop({type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting'})
  meeting: Meeting;

  @Prop({type: mongoose.SchemaTypes.ObjectId, ref: 'Group'})
  otherGroup: Group;

  @Prop({})
  dateProposal: Date;

  @Prop({})
  dateProposalEnd: Date;

  @Prop({ default: false })
  pending: boolean;

  @Prop({ default: false })
  place: boolean;

  @Prop({ default: false })
  setTimeAndPlace: boolean;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  image: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  unreadMessages: number;

  @Prop({type: mongoose.SchemaTypes.ObjectId, ref: 'Message'})
  lastMessage: Message;

  @Prop({ default: 0 })
  invitations: number;

  @Prop()
  isAdmin: boolean;
}

export type ChatDocument = Chat & mongoose.Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);
