import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schema/users.schema';
import { City } from '../../zone/schema/city.schema';

export class RegisterDTO {
  readonly name: string;

  readonly lastName: string;

  readonly DNI: number;

  email: string;

  readonly phoneNumber: number;

  readonly password: string;

  readonly address: string;

  readonly passwordRecover?: string;

  readonly confirmPasswordRecover?: boolean;
}

export class RegisterResDTO {
  response: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
