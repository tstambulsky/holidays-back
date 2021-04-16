import { Module, forwardRef } from '@nestjs/common';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { UsersModule } from '../../users/users.module';
import { ContactsModule } from '../../contacts/contacts.module';

@Module({
  imports: [forwardRef(() => UsersModule), ContactsModule],
  providers: [InstagramStrategy],
  exports: [InstagramStrategy]
})
export class InstagramModule {}
