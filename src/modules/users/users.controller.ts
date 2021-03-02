import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/data.dto';
import { User } from './schema/users.schema';
import { LoginDTO } from '../auth/dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get('/getuserbyemail')
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

  @Put('/update/:userID')
  async updateMeeting(@Res() res, @Param('userID') userID, @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    try {
      const updateUser = await this.userService.updateUser(userID, updateUserDTO);
      return res.status(HttpStatus.OK).json({
        message: 'User has been updated',
        User: updateUser
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

   @Put('/remove/:userID')
  async inactiveUser(@Res() res, @Param('userID') userID): Promise<string> {
    try {
      await this.userService.toInactiveUser(userID);
      return res.status(HttpStatus.OK).json({
        message: 'User removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Delete('/delete/:userID')
  async deleteMeeting(@Res() res, @Param('userID') userID): Promise<string> {
    try {
      await this.userService.deleteUser(userID);
      return res.status(HttpStatus.OK).json({
        message: 'Your user has been deleted and do not exist in the APP.'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }
}
