import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from '../../users/schema/users.schema'

export class LoginDTO {
   readonly email: string
   readonly password: string
}

export class LoginResDTO {
   token: string
   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
   user: User
}

export class AppleLoginDTO {
   readonly token: string
}
