import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
//import { LocalAuthGuard } from './modules/auth/guards/local-auth.guard';
//import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
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
}
