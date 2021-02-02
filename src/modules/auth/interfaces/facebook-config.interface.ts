import { Document } from 'mongoose';

export interface TokenPayload extends Document {
  userId: number;
}
