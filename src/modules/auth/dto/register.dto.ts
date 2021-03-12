import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schema/users.schema';

export class RegisterDTO {
  readonly name: string;

  readonly lastName: string;

  readonly DNI: number;

  email: string;

  readonly phoneNumber: number;

  readonly birthDate: Date;

  readonly sex: string;

  readonly password: string;

  readonly address: string;

  readonly passwordRecover?: string;

  readonly confirmPasswordRecover?: boolean;

  readonly isAdmin?: boolean;
  
  readonly latitude: number;

  readonly longitude: number;
}
