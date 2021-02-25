import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post } from '@nestjs/common';
import { MeetingPlaceService } from './meetingPlace.service';
import { Meeting } from './schema/meetingPlace.schema';
import { MeetingDTO, UpdateMeetingDTO } from './dto/meeting.dto';

@Controller()
export class MeetingPlaceController {
  constructor(private meetingPlaceService: MeetingPlaceService) {}

  @Get('/meetingPlace')
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

  @Get('/meetingPlace/:meetingID')
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

  @Post('/meetingPlace')
  async createMeeting(@Res() res, @Body() createMeetingDTO: MeetingDTO): Promise<string> {
    try {
      await this.meetingPlaceService.createMeeting(createMeetingDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Meeting place has been created'
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/meetingPlace/update/:meetingID')
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

  @Delete('/meetingPlace/delete/:meetingID')
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

  @Put('/remove/:meetingID')
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
}
