import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { UsersService } from '../users/users.service'

@Module({
   providers: [EmailService],
   exports: [EmailService],
})
export class EmailModule {}
