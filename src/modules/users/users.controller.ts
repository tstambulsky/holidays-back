import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, UploadedFiles, UseGuards, Query, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDTO, queryDTO, contactsDTO, PhotoDTO } from './dto/data.dto';
import { User } from './schema/users.schema';
import { LoginDTO } from '../auth/dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/currentUser';
import { multerOptions } from '../../config/multer';
import { Express } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { diskStorage } from 'multer';



@UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {
  SERVER_URL: string = process.env.URL;
  constructor(private userService: UsersService, 
    private _cloudinaryService: CloudinaryService) {}

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

  
  @Put('/update/:userId')
  async updateUser(@Res() res, @Body() updateUserDTO: UpdateUserDTO, @Param('userId') user): Promise<User> {
    try {
      const updateUser = await this.userService.updateUser(updateUserDTO, user);
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


  @Put('/updatelogged/')
  async updateUserLog(@Res() res, @Body() updateUserDTO: UpdateUserDTO, @CurrentUser() user): Promise<User> {
    try {
      const updateUser = await this.userService.updateUserLogged(updateUserDTO, user);
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

  @Post('/search/contacts')
  async getContacts(@Res() res, @Body() users: contactsDTO){
    try {
      const response = await this.userService.searchContact(users.users);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

  @Get('/search/user')
  async getByName(@Res() res, @Query() name: queryDTO){
    try {
      const users = await this.userService.searchByName(name);
      return res.status(HttpStatus.OK).json({
        users
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

  /*@Put('/update/photos') 
  async updatePhotos(@Res() res, @Body() data: PhotoDTO, @CurrentUser() user) {
  try {
    const response = await this.userService.updatePhoto(data, user);
    return res.status(HttpStatus.OK).json({
      response
    });
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: err.message
    });
  }
}*/

  @Post('/photos/profilephoto')
  @UseInterceptors(FileInterceptor('file', multerOptions
  ))
  async uploadPhotoProfile(@CurrentUser() user, @UploadedFile() file) {
    await this.userService.setProfilePhoto(user, file);
    await this._cloudinaryService.upload(file.path);
}

  @Get('/photos/:fileId')
  async servePhoto(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'assets'});
  }

  @Post('/uploadphotos')
  @UseInterceptors(FilesInterceptor('files', 6, {
    storage: multerOptions.storage
    }),
  )
  async uploadFiles(@CurrentUser() user, @UploadedFiles() files: Express.Multer.File) {
    await this.userService.updatePhotos(user, files);
    //console.log(files);
}

}
