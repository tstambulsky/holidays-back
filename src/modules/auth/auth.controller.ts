import {
  Controller,
  Get,
  Put,
  Post,
  Res,
  Req,
  HttpStatus,
  Body,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { LoginResDTO } from './dto/login.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO, ChangePasswordDTO, TokenCodeDTO } from './dto/Password.dto';
import { AuthGuard } from '@nestjs/passport';
import { VerifyFacebookDTO } from './dto/accessToken.dto';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Res() res, @Body() data: LoginDTO): Promise<LoginResDTO> {
    try {
      const userLogedd = await this.authService.login(data);
      return res.status(HttpStatus.OK).json({
        message: 'User has been logged',
        userLogedd
      });
    } catch (err) {
      console.log('Error in login');
      return res.status(HttpStatus.NOT_FOUND).json({
        message: err.message,
        status: 404
      });
    }
  }

  @Post('/loginsocial')
  async loginSocialNetworks(@Res() res, @Body() data: LoginDTO): Promise<LoginResDTO> {
    try {
      const userLogedd = await this.authService.loginSocial(data.email, data.provider);
      return res.status(HttpStatus.OK).json({
        message: 'User has been logged',
        userLogedd
      });
    } catch (err) {
      console.log('Error in login');
      return res.status(HttpStatus.NOT_FOUND).json({
        message: err.message,
        status: 404
      });
    }
  }

  @Post('/loginapple')
  async loginWithApple(@Res() res, @Body() data: LoginDTO): Promise<LoginResDTO> {
    try {
      const userLogedd = await this.authService.loginApple(data.appleId);
      return res.status(HttpStatus.OK).json({
        message: 'User has been logged',
        userLogedd
      });
    } catch (err) {
      console.log('Error in login');
      return res.status(HttpStatus.NOT_FOUND).json({
        message: err.message,
        status: 404
      });
    }
  }
  

  @UseGuards(AuthGuard('facebook'))
  @Get('/facebook/login')
  async getTokenAfterFacebookSignIn(@Res() res, @Req() req): Promise<any> {
    console.log(req.user);
}

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user
    };
  }

  @Post('social/verify')
  async verifyFacebookUser(@Res() res, @Body() data: VerifyFacebookDTO) {
    try {
    const response = await this.authService.socialLogin(data.providerId, data.provider);
    return res.status(HttpStatus.OK).json({
      response
    })
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: error.message
    })
  }
  } 

  @Get('/instagram/login')
  @UseGuards(AuthGuard('instagram'))
  async getTokenAfterInstagramSignIn(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/instagram/redirect')
  @UseGuards(AuthGuard('instagram'))
  async instagramAuthRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user
    };
  }

  @Post('/register')
  async registerUser(@Res() res, @Body() registerDTO: RegisterDTO) {
    try {
      const createUser = await this.authService.registerUser(registerDTO);
      if (createUser) {
        return res.status(HttpStatus.OK).json({
          createUser
        });
      }
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
        status: 400
      });
    }
  }

  @Post('/send-recover')
  async sendRecoverPassword(@Res() res, @Body() forgotPasswordDTO: ForgotPasswordDTO) {
    const { email } = forgotPasswordDTO;
    try {
      await this.authService.sendRecoverPassword(email);
      return res.status(HttpStatus.OK).json({ message: 'Email send' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('/confirm-recover')
  async confirmRecoverPassword(@Res() res, @Body() token: TokenCodeDTO) {
    const { code } = token;
    try {
      const data = await this.authService.recoverPassword(code);
      return res.status(HttpStatus.OK).json({ data, message: 'Confirmed access for password change' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      console.log(error);
    }
  }

  @Post('/change-password')
  async changePassword(@Res() res, @Body() changePasswordDTO: ChangePasswordDTO) {
    const { email, password } = changePasswordDTO;
    try {
      await this.authService.changePassword(email, password);
      return res.status(HttpStatus.OK).json({ message: 'Password change successful!' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
