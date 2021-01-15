import { Document } from 'mongoose';
import { City } from '../../zone/schema/city.schema';

export interface IUser extends Document {
  readonly name: string;
  readonly lastName: string;
  readonly DNI: number;
  readonly email: string;
  readonly birthDate: Date;
  readonly phoneNumber: number;
  readonly city: City;
  readonly password: string;
  readonly addressStreet: string;
  readonly addressNumber: number;
  readonly addressFloor: number;
  readonly addressApartment: string;
  readonly passwordRecover?: string;
  readonly confirmPasswordRecover?: boolean;
  //readonly screen: any;
  // readonly rol: any;
}
