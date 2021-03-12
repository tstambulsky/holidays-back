import { Document } from 'mongoose';

export interface UserDTO extends Document {
  readonly name: string;
  readonly lastName: string;
  readonly DNI: number;
  readonly email: string;
  readonly phoneNumber: number;
  readonly password: string;
  readonly address: string;
  readonly passwordRecover?: string;
  readonly confirmPasswordRecover?: boolean;
  readonly latitude: number;
  readonly longitude: number;
}

export class UpdateUserDTO {
  readonly name?: string;
  readonly lastName?: string;
  readonly DNI?: number;
  readonly email?: string;
  readonly phoneNumber?: number;
  readonly password?: string;
  readonly address?: string;
  readonly passwordRecover?: string;
  readonly confirmPasswordRecover?: boolean;
  readonly latitude?: number;
  readonly longitude?: number;
}

export class queryDTO {
  readonly name: string;
}

export class contactsDTO {
  readonly users: any[];
}

export class PhotoDTO {
  readonly photo: {
    photoUrl: String,
    public_id: String
  };
}