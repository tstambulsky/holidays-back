import { Injectable, ForbiddenException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument  } from '../../users/schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as appleSignin from 'apple-signin';
import { appleConfig } from '../../../config/apple';

@Injectable()
export class AppleService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  public async verifyUser(payload: any): Promise<any> {
    const clientSecret = appleSignin.getClientSecret({
      clientID: appleConfig.client_id,
      teamId: appleConfig.team_id,
      keyIdentifier: appleConfig.key_id,
      privateKeyPath: appleConfig.apple_key,
    });

    const tokens = await appleSignin.getAuthorizationToken(payload.code, {
      clientID: appleConfig.client_id,
      clientSecret: clientSecret,
      redirectUri: appleConfig.redirect_uri,
    });

    if (!tokens.id_token) {
      console.log('no token.id_token');
      throw new ForbiddenException();
    }

    console.log('tokens', tokens);

    // TODO: AFTER THE FIRST LOGIN APPLE WON'T SEND THE USERDATA ( FIRST NAME AND LASTNAME, ETC.) THIS SHOULD BE SAVED ANYWHERE

    const data = await appleSignin.verifyIdToken(tokens.id_token);
    return { data, tokens };
    console.log('data', data);
  }
}
}
