import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, Post, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MeetingPlaceService } from './meetingPlace.service';
import { Meeting } from './schema/meetingPlace.schema';
import { MeetingDTO, UpdateMeetingDTO } from './dto/meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { multerOptions } from '../../config/multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('/api')
export class MeetingPlaceController {
  constructor(private meetingPlaceService: MeetingPlaceService,
    private readonly _cloudinaryService: CloudinaryService) {}

  @Get('/meetingplace')
  async getMeetings(@Res() res): Promise<Meeting[]> {
    try {
      const meetings = await this.meetingPlaceService.getAll();
      return res.status(HttpStatus.OK).json({
        message: 'List of Meetings',
        meetings
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/meetingplace/:meetingID')
  async getMeeting(@Res() res, @Param('meetingID') meetingID) {
    try {
      const meetings = await this.meetingPlaceService.getMeeting(meetingID);
      if (!meetings) throw new NotFoundException('Meeting does not exists');
      return res.status(HttpStatus.OK).json(meetings);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Post('/meetingplace')
  async createMeeting(@Res() res, @Body() createMeetingDTO: MeetingDTO): Promise<Meeting> {
    try {
      const response = await this.meetingPlaceService.createMeeting(createMeetingDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Meeting place has been created',
        data: response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/meetingplace/update/:meetingID')
  async updateMeeting(@Res() res, @Param('meetingID') meetingID, @Body() updateMeetingDTO: UpdateMeetingDTO): Promise<Meeting> {
    try {
      const updateMeeting = await this.meetingPlaceService.updateMeeting(meetingID, updateMeetingDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Meeting place has been updated',
        Meeting: updateMeeting
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Delete('/meetingplace/delete/:meetingID')
  async deleteMeeting(@Res() res, @Param('meetingID') meetingID): Promise<string> {
    try {
      await this.meetingPlaceService.deleteMeeting(meetingID);
      return res.status(HttpStatus.OK).json({
        message: 'Meeting place deleted'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Put('/meetingplace/remove/:meetingID')
  async inactiveGroup(@Res() res, @Param('meetingID') meetingID): Promise<string> {
    try {
      await this.meetingPlaceService.toInactiveMeeting(meetingID);
      return res.status(HttpStatus.OK).json({
        message: 'Meeting removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
        err: err.message
      });
    }
  }
  @Post('/meetingplace/photo/:meetingId')
  @UseInterceptors(FileInterceptor('file', multerOptions
  ))
  async uploadPhotoProfile(@Res() res, @Param('meetingId') meetingId, @UploadedFile() file) {
    const data = await this._cloudinaryService.upload(file.path);
    const response = await this.meetingPlaceService.setMeetingPhoto(meetingId, file, data.url);
    return res.status(HttpStatus.OK).json({
      response
    })

    
}

  @Post('/meetingplace/uploadphotos/:meetingId')
  @UseInterceptors(FilesInterceptor('files', 6, {
    storage: multerOptions.storage
    }),
  )
  async uploadFiles(@Res() res, @Param('meetingId') meetingId, @UploadedFiles() files: Express.Multer.File) {
    const response = await this.meetingPlaceService.updatePhotos(meetingId, files);
    return res.status(HttpStatus.OK).json({
      response
    })
  }

  @Get('/meetingplace/photos/:fileId')
  async servePhoto(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'assets'});
  }

}
