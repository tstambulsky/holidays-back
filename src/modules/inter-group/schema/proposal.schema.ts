import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Group } from 'src/modules/group/schema/group.schema';
import { Meeting } from 'src/modules/meeting-place/schema/meetingPlace.schema';
import { InterGroup } from './interGroup.schema';

@Schema({ timestamps: true })
export class Proposal {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'InterGroup' })
  interGroup: InterGroup;

  @Prop({ default: Date.now })
  proposalDate: Date;

  @Prop({})
  proposalHour: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Meeting' })
  proposalPlace: Meeting;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupSender: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupReceiver: Group;

  @Prop({ default: false })
  success: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: Date.now })
  created: Date;
}

export type ProposalDocument = Proposal & mongoose.Document;
export const ProposalSchema = SchemaFactory.createForClass(Proposal);
