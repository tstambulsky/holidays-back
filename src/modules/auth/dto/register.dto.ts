import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schema/users.schema';
import { City } from '../../zone/schema/city.schema';

export class RegisterDTO {
  readonly name: string;

  readonly lastName: string;

  readonly DNI: number;

  email: string;

  readonly phoneNumber: number;

  readonly birthDate: Date;

  readonly sex: string;

  readonly city: City;

  readonly password: string;

  readonly address: string;

  readonly passwordRecover?: string;

  readonly confirmPasswordRecover?: boolean;

  readonly isAdmin?: boolean;
}
