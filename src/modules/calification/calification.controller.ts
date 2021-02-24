import { Controller, Res, HttpStatus, Body, Post } from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CalificationDTO } from './dto/inputs.dto';

@Controller('/calification')
export class CalificationController {
  constructor(private calificationService: CalificationService) {}

  @Post('/')
  async createCalification(@Body() data: CalificationDTO, @Res() res) {
    try {
      const calification = await this.calificationService.createCalification(data);
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
