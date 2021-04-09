import { Controller, Res, HttpStatus, Body, Post, Get, UseGuards, Param } from '@nestjs/common';
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

  @Get('/needcalification/:interGroupId')
  async getWithoutCalification(@Res() res, @Param('interGroupId') interGroupId, @CurrentUser() user) {
    try {
      const response = await this.calificationService.getUsersWithoutCalification(interGroupId, user);
      return res.status(HttpStatus.OK).json({
        response
      })

    } catch ( error ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  }

  @Get('/needcalification')
  async getWithoutCalifications(@Res() res,@CurrentUser() user) {
    try {
      const response = await this.calificationService.getUsersWithoutCalifications(user);
      return res.status(HttpStatus.OK).json({
        response
      })

    } catch ( error ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  }
}
