import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from '../auth/dto/login.dto';
import { IUser } from './interfaces/users.interface';

@Controller('/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/')
  async getUsers(@Res() res) {
    try {
      const users = await this.userService.getUsers();
      return res.status(HttpStatus.OK).json({
        message: 'List of Users',
        users
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/getUserByEmail')
  async getOneUserEmail(@Res() res, @Body() data: LoginDTO) {
    return await this.userService.getUserByEmail(data.email);
  }

  @Get('/:userID')
  async getUser(@Res() res, @Param('userID') userID) {
    try {
      const user = await this.userService.getUserById(userID);
      if (!user) throw new NotFoundException('User does not exists');
      return res.status(HttpStatus.OK).json(user);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  /* @Post('/register')
  async createUser(@Res() res,@Body() user: User): Promise<User | Object> {
    try {
      return await this.userService.createUser(user);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      })
    }
  } */
}
