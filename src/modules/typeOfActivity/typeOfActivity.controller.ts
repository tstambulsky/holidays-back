import { Controller, Res, Param, HttpStatus, Body, Post, Get, Put, UseGuards, Delete } from '@nestjs/common';
import { TypeOfActivityService } from './typeOfActivity.service';
import { TypeActivityDTO } from './dto/typeOfActivity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/typeofactivity')
export class TypeOfActivityController {
  constructor(private typeOfActivityService: TypeOfActivityService) {}

  @Get('/')
  async getTypes(@Res() res) {
    try {
    const types = await this.typeOfActivityService.getTypes();
    return res.status(HttpStatus.OK).json({
      message: 'List of Types of activities',
      types
    })
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      err: err.message
    })
  }
  }

  @Get('/:typeId')
  async getType(@Res() res, @Param('typeId') typeId) {
    try {
      const type = await this.typeOfActivityService.getType(typeId);
      return res.status(HttpStatus.OK).json({
        type
      })
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      })
    }
  }

  @Post('/')
  async createType(@Body() data: TypeActivityDTO, @Res() res) {
    try {
      const type = await this.typeOfActivityService.createType(data);
      return res.status(HttpStatus.OK).json({
        message: 'Type of activity Created'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Put('/update/:typeId')
  async updateType (@Body() data: TypeActivityDTO, @Res() res, @Param('typeId') typeId) {
     try {
      const type = await this.typeOfActivityService.updateType(typeId, data);
      return res.status(HttpStatus.OK).json({
        message: 'Type of activity updated!',
        type
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Delete('/delete/:typeId')
  async deleteType (@Res() res, @Param('typeId') typeId) {
     try {
      await this.typeOfActivityService.deleteType(typeId);
      return res.status(HttpStatus.OK).json({
        message: 'Type of activity deleted.'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }

  }
  }

