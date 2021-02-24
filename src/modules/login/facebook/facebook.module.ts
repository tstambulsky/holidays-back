import { Module } from '@nestjs/common'
import { FacebookStrategy } from './strategies/facebook.strategy'
import { UsersModule } from '../../users/users.module'
import { ContactsModule } from '../../contacts/contacts.module'

@Module({
   imports: [UsersModule, ContactsModule],
   providers: [FacebookStrategy],
   exports: [FacebookStrategy],
})
export class FacebookModule {}
