import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { City } from '../../zone/schema/city.schema';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true })
  name: string;

  @Prop()
  lastName: string;
  
  @Prop({ required: false })
  provider?: string;
  
  @Prop({ required: false })
  provider_id: string;
  
  @Prop({ required: false })
  apple_id?: string;
  
  @Prop({type:[String], required: false })
  photo?: string[];
  
  @Prop({ required: false })
  profilePhoto?: string;

  @Prop({ required: false })
  DNI?: number;
  
  @Prop({ required: false, unique: true })
  email?: string;
  
  @Prop()
  birthDate: Date;
  
  @Prop({enum: ['Male', 'Female', 'Other']})
  sex: string;
  
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'City', autopopulate: true })
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
  
  @Prop()
  calification: boolean;
  
  @Prop()
  comment: string;

  @Prop({type:Number, default:0})
  points: number;

  @Prop({ default: true})
  active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
