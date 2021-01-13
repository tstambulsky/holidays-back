import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schema/users.schema';
import { City } from '../../zone/schema/city.schema';

export class RegisterDTO {
  readonly name: string;

  readonly lastName: string;

  readonly DNI: number;

  email: string;

  readonly birthDate: Date;

  readonly phoneNumber: number;
  
  readonly city: City;

  readonly password: string;

  readonly addressStreet: string;

  readonly addressNumber: number;

  readonly addressFloor?: number;

  readonly addressApartment?: string;

  readonly passwordRecover?: string;

  readonly confirmPasswordRecover?: boolean;
}

export class RegisterResDTO {
  response: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
