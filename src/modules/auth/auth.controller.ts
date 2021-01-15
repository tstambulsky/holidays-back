import {
  Controller,
  Get,
  Put,
  Post,
  Res,
  Req,
  HttpStatus,
  Body,
  Query,
  Param,
  NotFoundException,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { AccessTokenDto } from './dto/accessToken.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { Request } from 'express';
import { LoginResDTO } from './dto/login.dto';
import { RegisterResDTO } from './dto/register.dto';
import { LoginDTO, AppleLoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO, ChangePasswordDTO, TokenCodeDTO } from './dto/Password.dto';
import AppleAuth from '../login/apple/utils/appleAuth';
import * as jwt from 'jsonwebtoken';
import { AppleService } from '../login/apple/apple.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/api/login')
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
        message: 'Error: User not logged!',
        status: 404
      });
    }
  }

  @Get('/auth/facebook/login')
  @UseGuards(AuthGuard('facebook'))
  async getTokenAfterFacebookSignIn(@Req() req) {
    console.log(req.user);
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request) {
    return {
      statusCode: HttpStatus.OK,
      data: req.user
    };
  }

  @Get('/access_token')
  accessToken(@Query(ValidationPipe) accessTokenDto: AccessTokenDto): Promise<AxiosResponse> {
    return this.authService.accessToken(accessTokenDto);
  }

  @Get('/refresh_access_token')
  refreshAccessToken(@Query(ValidationPipe) refreshAccessTokenDto: RefreshAccessTokenDto): Promise<AxiosResponse> {
    return this.authService.refreshAccessToken(refreshAccessTokenDto);
  }

  /*@Get('/auth/instagram/login')
  @UseGuards(AuthGuard('instagram'))
  async getTokenAfterInstagramSignIn(@Req() req) {
    console.log(req.user);
  }

  @Get('/instagram/redirect')
  @UseGuards(AuthGuard('instagram'))
  async instagramAuthRedirect(@Req() req: Request) {
    return {
      statusCode: HttpStatus.OK,
      data: req.user
    };
  }*/

  /* @Post('/login/apple')
  async appleAuth(@Res() res, @Body() token: string) {
    const appleToken = token;
    try {
      const apple = await AppleAuth.accessToken(appleToken);
      const appleData = jwt.decode(apple.id_token);

      const { sub: appleId } = appleData;

      const user = await this.appleService.UpdateOne(
        { appleId },
        { $inc: { nbOfConnections: 1 } },
        { upsert: true, new: true, useFindAndModify: false }
      );
      return res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message || err });
    }
  }*/

  @Post('/api/register')
  async registerUser(@Res() res, @Body() registerDTO: RegisterDTO) {
    try {
      const createUser = await this.authService.registerUser(registerDTO);
      return res.status(HttpStatus.OK).json({
        message: 'User has been created successfully',
        createUser
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not created!',
        status: 400
      });
    }
  }

  @Post('/api//send-recover')
  async sendRecoverPassword(@Res() res, @Body() forgotPasswordDTO: ForgotPasswordDTO) {
    const { email } = forgotPasswordDTO;
    try {
      await this.authService.sendRecoverPassword(email);
      return res.status(HttpStatus.OK).json({ message: 'Email send' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('/api//confirm-recover')
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

  @Post('/api//change-password')
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
