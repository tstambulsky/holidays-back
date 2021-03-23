import { Document } from 'mongoose';
import { State } from '../../zone/schema/state.schema';
import { City } from '../../zone/schema/city.schema';

export interface UserDTO extends Document {
  readonly name: string;
  readonly lastName: string;
  readonly DNI: number;
  readonly email: string;
  readonly phoneNumber: number;
  readonly password: string;
  readonly address: string;
  readonly city: City;
  readonly state: State;
  readonly passwordRecover?: string;
  readonly confirmPasswordRecover?: boolean;
  readonly latitude: number;
  readonly longitude: number;
  readonly deviceToken?: string;
}

export class UpdateUserDTO {
  readonly name?: string;
  readonly lastName?: string;
  readonly DNI?: number;
  readonly email?: string;
  readonly phoneNumber?: number;
  readonly city: City;
  readonly state: State;
  readonly password?: string;
  readonly address?: string;
  readonly passwordRecover?: string;
  readonly confirmPasswordRecover?: boolean;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly deviceToken?: string;
}

export class queryDTO {
  readonly name: string;
}

export class contactsDTO {
  readonly users: any[];
}

export class PhotoDTO {
  readonly photo: {
    photoUrl: any;
    public_id: any;
  };
}
