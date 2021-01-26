import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: false })
  provider?: string;
  @Prop({ required: false, unique: true })
  provider_id?: string;
  @Prop({ required: false, unique: true })
  apple_id?: string;
  @Prop({ required: false })
  photo?: string;
  @Prop({ required: false })
  DNI?: number;
  @Prop({ required: false })
  email?: string;
  @Prop({ required: false })
  phoneNumber?: number;
  @Prop({ required: false })
  password?: string;
  @Prop({ required: false })
  address?: string;
  @Prop({ required: false })
  passwordRecover?: string;
  @Prop({ default: false, required: false })
  confirmPasswordRecover?: boolean;
  @Prop()
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', true);
