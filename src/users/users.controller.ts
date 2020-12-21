import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Res,
    HttpStatus,
    Body,
    Query,
    Param,
    NotFoundException
} from '@nestjs/common';
import { CreateUserDTO } from './dto/users.dto';
import { UsersService } from './users.service';
4;
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('/')
    async createPost(@Res() res, @Body() createUserDTO: CreateUserDTO) {
        try {
            const user = await this.userService.createUser(createUserDTO);
            return res.status(HttpStatus.OK).json({
                message: 'Success',
                user
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                err: err.message
            });
        }
    }

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

    @Get('/:userID')
    async getUser(@Res() res, @Param('userID') userID) {
        try {
            const user = await this.userService.getOneUser(userID);
            if (!user) throw new NotFoundException('User does not exists');
            return res.status(HttpStatus.OK).json(user);
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                err: err.message
            });
        }
    }

    @Delete('/delete')
    async deleteUser(@Res() res, @Query('userID') userID) {
        try {
            const user = await this.userService.deleteUser(userID);
            if (!user) throw new NotFoundException('User does not exists');
            return res.status(HttpStatus.OK).json({
                message: 'User deleted succesfully'
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                err: err.message
            });
        }
    }

    @Put('/update')
    async updateUser(@Res() res, @Body() createUserDTO: CreateUserDTO, @Query('userID') userID) {
        try {
            const user = await this.userService.updateUser(userID, createUserDTO);
            if (!user) throw new NotFoundException('User does not exists');
            return res.status(HttpStatus.OK).json({
                message: 'Product updated succesfully',
                user
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                err: err.message
            });
        }
    }
}
