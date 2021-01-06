import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  DNI: number;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  phoneNumber: number;
  @Prop({ required: true })
  birthDate: Date;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  addressStreet: string;
  @Prop({ required: true })
  addressNumber: number;
  @Prop()
  addressFloor?: number;
  @Prop()
  addressApartment?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
