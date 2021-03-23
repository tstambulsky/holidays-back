import { Module } from '@nestjs/common';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { UsersModule } from '../../users/users.module';
import { ContactsModule } from '../../contacts/contacts.module';

@Module({
  imports: [UsersModule, ContactsModule],
  providers: [InstagramStrategy],
  exports: [InstagramStrategy]
})
export class InstagramModule {}
