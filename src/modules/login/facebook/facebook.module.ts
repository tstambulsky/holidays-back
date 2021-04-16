import { Module, forwardRef } from '@nestjs/common';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UsersModule } from '../../users/users.module';
import { ContactsModule } from '../../contacts/contacts.module';

@Module({
  imports: [forwardRef(() => UsersModule), ContactsModule],
  providers: [FacebookStrategy],
  exports: [FacebookStrategy]
})
export class FacebookModule {}
