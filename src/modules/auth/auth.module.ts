import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { tokenConfig } from '../../config/token'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'
import { EmailModule } from '../email/email.module'
import { AppleModule } from '../login/apple/apple.module'
import { FacebookStrategy } from '../login/facebook/strategies/facebook.strategy'
import { FacebookModule } from '../login/facebook/facebook.module'
import { InstagramStrategy } from '../login/instagram/strategies/instagram.strategy'
import { InstagramModule } from '../login/instagram/instagram.module'
import { ContactsModule } from '../contacts/contacts.module'
import { ConfigService } from '@nestjs/config'
//import { LocalStrategy } from './strategies/local.strategy';

@Module({
   imports: [
      UsersModule,
      PassportModule,
      EmailModule,
      AppleModule,
      FacebookModule,
      InstagramModule,
      ContactsModule,
      JwtModule.register({
         secret: tokenConfig.secretKey,
         signOptions: { expiresIn: tokenConfig.expirationDay },
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy, FacebookStrategy, InstagramStrategy, ConfigService],
   exports: [AuthService],
})
export class AuthModule {}
