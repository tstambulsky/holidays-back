import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { InterGroup } from 'src/modules/inter-group/schema/interGroup.schema';
import { User } from 'src/modules/users/schema/users.schema';

@Schema({ timestamps: true })
export class Calification {
  @Prop({ default: true })
  success: boolean;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User'})
  toUser: User;
  
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User'})
  fromUser: User;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'InterGroup'})
  interGroup: InterGroup;

  @Prop()
  comment: string;
}

export type CalificationDocument = Calification & mongoose.Document;
export const CalificationSchema = SchemaFactory.createForClass(Calification);
