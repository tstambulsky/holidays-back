import { Schema } from 'mongoose';

export class RegisterDTO {
  readonly name: string;

  readonly lastName: string;

  readonly DNI: number;

  readonly email: string;

  readonly birthDate: Date;

  readonly phoneNumber: number;
  // readonly city: any;

  readonly password: string;

  readonly addressStreet: string;

  readonly addressNumber: number;

  readonly addressFloor: number;

  readonly addressApartment: string;
}

export class RegisterResDTO {
  readonly response: string;
  readonly user?: [
    {
      type: Schema.Types.ObjectId;
      ref: 'Users';
    }
  ];
}
