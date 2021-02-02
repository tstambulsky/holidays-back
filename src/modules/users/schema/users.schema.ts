import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { City } from '../../zone/schema/city.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop()
  name: string;
  @Prop()
  lastName: string;
  @Prop({ required: false })
  provider?: string;
  @Prop({ required: false })
  provider_id: string;
  @Prop({ required: false })
  apple_id?: string;
  @Prop({ required: false })
  photo?: string;
  @Prop({ required: false })
  DNI?: number;
  @Prop({ required: false })
  email?: string;
  @Prop()
  birthDate: Date;
  @Prop()
  sex: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;
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
  @Prop({ default: false })
  isAdmin: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', true);
