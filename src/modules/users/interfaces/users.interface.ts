import { Document } from 'mongoose'
import { City } from '../../zone/schema/city.schema'

export interface IUser extends Document {
   readonly name: string
   readonly lastName: string
   readonly DNI: number
   readonly email: string
   readonly phoneNumber: number
   readonly password: string
   readonly address: string
   readonly passwordRecover?: string
   readonly confirmPasswordRecover?: boolean
}
