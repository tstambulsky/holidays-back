import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly lastName: string;
  readonly DNI: number;
  readonly email: string;
  readonly birthDate: Date;
  readonly sex: string;
  readonly city: any;
  readonly password: string;
  readonly addressStreet: string;
  readonly addressNumber: number;
  readonly addressFloor: number;
  readonly addressApartment: string;
  readonly screen: any;
  readonly rol: any;
  readonly timestamps: Date;
}
