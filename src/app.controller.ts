import { Controller, Request, Post, Get, UseGuards, Res } from '@nestjs/common'
import { AppService } from './app.service'
//import { LocalAuthGuard } from './modules/auth/guards/local-auth.guard';
//import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
   constructor(private readonly appService: AppService) {}

   @Get()
   getHello(): string {
      return this.appService.getHello()
   }

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
