import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserAppleDocument = Apple & mongoose.Document;

@Schema()
export class Apple {
  @Prop({ required: true })
  appleId: string;
  @Prop({ required: true })
  nbOfConnections: number;
}
export const UserAppleSchema = SchemaFactory.createForClass(Apple);
