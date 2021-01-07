import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  readonly lastName: string;
  readonly DNI: number;
  readonly email: string;
  readonly birthDate: Date;
  readonly phoneNumber: number;
  //readonly city: any;
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
