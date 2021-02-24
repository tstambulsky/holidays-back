import { Document } from 'mongoose'
import { User } from '../../users/schema/users.schema'

export class MessageDTO extends Document {
   author: User
   content: String
}
