import { Controller, Get, Put, Post, Res, HttpStatus, Body, Query, Param, NotFoundException } from '@nestjs/common';
import { LoginResDTO } from './dto/login.dto';
import { RegisterResDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Res() res, @Body() data: LoginDTO): Promise<LoginResDTO> {
    try {
    const userLogin = await this.authService.login(data);
     return res.status(HttpStatus.OK).json({
        message: 'User has been logged',
        userLogin
      });
  } catch (err) {
     return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User was unable to login!',
        status: 400
      });
  }
  }

  @Post('/register')
  async registerUser(@Res() res, @Body() registerDTO: RegisterDTO){
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
}
