import { Document } from 'mongoose'

export interface UserDTO extends Document {
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

export class UpdateUserDTO {
   readonly name?: string
   readonly lastName?: string
   readonly DNI?: number
   readonly email?: string
   readonly phoneNumber?: number
   readonly password?: string
   readonly address?: string
   readonly passwordRecover?: string
   readonly confirmPasswordRecover?: boolean
}
