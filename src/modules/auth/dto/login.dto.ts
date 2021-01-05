import { Schema, Document } from 'mongoose';
import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString() readonly email: string;
  @IsString() readonly password: string;
}

export class LoginResDTO {
  @IsString() readonly token: string;
  readonly user: [
    {
      type: Schema.Types.ObjectId;
      ref: 'Users';
    }
  ];
}
