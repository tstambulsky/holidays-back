import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/users.schema';
import * as mongoose from 'mongoose';
import { Group } from './group.schema';

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  group: Group;

  @Prop({ default: false })
  fromAdmin: boolean;

  @Prop({ default: false })
  success: boolean;

  @Prop({ default: true })
  active: boolean;
}

export type InvitationDocument = Invitation & mongoose.Document;
export const InvitationSchema = SchemaFactory.createForClass(Invitation);
