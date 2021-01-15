import { Module, HttpModule } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { InstagramService } from './instagram.service';
import { InstagramController } from './instagram.controller';
@Module({
  imports: [
  HttpModule.register({
  	timeout: 5000,
  	maxRedirects: 5,
  	baseURL: 'https://graph.instagram.com/'
  }),
  UsersModule],
  controllers: [InstagramController],
  providers: [InstagramService],
  exports: []
})
export class InstagramModule {}
