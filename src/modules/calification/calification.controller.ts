import { Controller, Res, HttpStatus, Body, Post, Get, UseGuards } from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CalificationDTO } from './dto/inputs.dto';
import { CurrentUser } from '../users/decorators/currentUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/calification')
export class CalificationController {
  constructor(private calificationService: CalificationService) {}

  @Get('/')
  async getCalifications(@Res() res) {
    try {
    const califications = await this.calificationService.getCalifications();
    return res.status(HttpStatus.OK).json({
      message: 'List of califications',
      califications
    })
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      err: err.message
    })
  }
  }

  @Post('/')
  async createCalification(@Body() data: CalificationDTO, @Res() res, @CurrentUser() user) {
    try {
      const calification = await this.calificationService.createCalification(data, user);
      return res.status(HttpStatus.OK).json({
        message: 'Calification Created',
        calification
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }
}
