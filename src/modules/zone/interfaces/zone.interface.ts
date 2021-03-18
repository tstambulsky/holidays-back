import { Document } from 'mongoose';

export interface IZone extends Document {
  readonly postalCode: number;
  readonly city: string;
  readonly state: number;
  readonly country: string;
}
