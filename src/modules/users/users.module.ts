import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { EmailModule } from '../email/email.module'
import { EmailService } from '../email/email.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schema/users.schema'

@Module({
   imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), EmailModule],
   controllers: [UsersController],
   providers: [UsersService, EmailService],
   exports: [UsersService],
})
export class UsersModule {}
