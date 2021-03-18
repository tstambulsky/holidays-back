import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { State } from '../../zone/schema/state.schema';
import { City } from '../../zone/schema/city.schema';

export class RegisterDTO {
  readonly name: string;

  readonly lastName: string;

  readonly DNI: number;

  readonly email: string;

  readonly phoneNumber: number;

  readonly birthDate: Date;

  readonly city?: City;

  readonly state?: State;

  readonly sex: string;

  readonly password: string;

  readonly address: string;

  readonly passwordRecover?: string;

  readonly confirmPasswordRecover?: boolean;

  readonly isAdmin?: boolean;
  
  readonly latitude: number;

  readonly longitude: number;
}
