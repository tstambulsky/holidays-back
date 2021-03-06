import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-instagram';
import { Inject } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { instagramConfig } from '../../../../config/instagram';

export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor(@Inject(UsersService) private readonly userService: UsersService) {
    super({
      clientID: instagramConfig.INSTAGRAM_APP_ID,
      clientSecret: instagramConfig.INSTAGRAM_APP_SECRET,
      callbackURL: instagramConfig.INSTAGRAM_CALLBACK,
      profileFields: ['id', 'displayName', /*'provider',*/ 'photos', 'name', 'emails']
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    console.log(profile);
    const user = await this.userService.findOrCreateInstagram(accessToken, refreshToken, profile, done);
    return done(null, user);
  }
}
