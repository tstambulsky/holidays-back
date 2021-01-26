import { Module } from '@nestjs/common';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { UsersModule } from '../../users/users.module';
@Module({
  imports: [UsersModule],
  providers: [InstagramStrategy],
  exports: [InstagramStrategy]
})
export class InstagramModule {}
