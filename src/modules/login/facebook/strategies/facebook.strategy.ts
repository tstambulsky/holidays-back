import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-facebook'
import { use } from 'passport'
import { Inject } from '@nestjs/common'
import { UsersService } from '../../../users/users.service'
import { ContactsService } from '../../../contacts/contacts.service'
import { facebookConfig } from '../../../../config/facebook'

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
   constructor(
      @Inject(UsersService) private readonly userService: UsersService,
      @Inject(ContactsService) private readonly contactsService: ContactsService
   ) {
      super({
         clientID: facebookConfig.FACEBOOK_APP_ID,
         clientSecret: facebookConfig.FACEBOOK_APP_SECRET,
         callbackURL: facebookConfig.FACEBOOK_CALLBACK,
         scope: 'email',
         profileFields: ['id', 'displayName' /*'provider'*/, , 'photos', 'name', 'email', 'friends'],
      })
   }
   async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
      const user = await this.userService.findOrCreateFB(accessToken, refreshToken, profile, done)
      //const contacts = await this.contactsService.createListContactsFB(accessToken, refreshToken, profile, done);
      const payload = {
         user,
         accessToken,
      }
      return done(null, payload)
   }
}
