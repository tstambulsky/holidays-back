import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
//import { LocalAuthGuard } from './modules/auth/guards/local-auth.guard';
//import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  /* @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  } */

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
