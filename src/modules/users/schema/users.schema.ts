import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { City } from '../../zone/schema/city.schema';
import { State } from '../../zone/schema/state.schema';

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

  @Prop({ type: [{}], required: false, minItems: 0, maxItems: 6 })
  photos: [{
    photoUrl: String,
    public_id: String
  }
]

  @Prop({ required: false })
  profilePhoto?: string;

  @Prop({ required: false })
  DNI?: number;

  @Prop({ required: false, unique: true })
  email?: string;

  @Prop()
  birthDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City'})
  city?: City;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'State'})
  state?: State;

  @Prop({ enum: ['male', 'female', 'other'] })
  sex: string;

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

  @Prop({ type: Number, default: 0 })
  points: number;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
