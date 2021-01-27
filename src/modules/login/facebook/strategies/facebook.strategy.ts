import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Inject } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { facebookConfig } from '../../../../config/facebook';

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(@Inject(UsersService) private readonly userService: UsersService) {
    super({
      clientID: facebookConfig.FACEBOOK_APP_ID,
      clientSecret: facebookConfig.FACEBOOK_APP_SECRET,
      callbackURL: facebookConfig.FACEBOOK_CALLBACK,
      profileFields: ['id', 'displayName', /*'provider'*/, 'photos', 'name', 'emails']
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    const user = await this.userService.findOrCreateFB(accessToken, refreshToken, profile, done);
    return done(null, user);
  }
}
