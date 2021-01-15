import { Module } from '@nestjs/common';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [FacebookStrategy],
  exports: [FacebookStrategy]
})
export class FacebookModule {}
