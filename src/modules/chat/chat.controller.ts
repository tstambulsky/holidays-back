import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CurrentUser } from 'src/modules/users/decorators/currentUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('/chat')
export class ChatController {
  constructor(private chatService: ChatService) { }

  @Get('/group')
  async getGroupChat(@Res() res, @CurrentUser() user) {
    try {
      const response = await this.chatService.getChatGroupUser(user)
      res.status(HttpStatus.OK).json({
        response
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  };

  @Get('/intergroups')
  async getInterGroupChat(@Res() res, @CurrentUser() user) {
    try {
      const response = await this.chatService.getChatInterGroupsUser(user)
      res.status(HttpStatus.OK).json({
        response
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  };

  @Get('/admin/:groupId')
  async getAdminChat(@Res() res, @Param('groupId') groupId, @CurrentUser() user) {
    try {
      const response = await this.chatService.getChatAdmin(groupId)
      res.status(HttpStatus.OK).json({
        response
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  };

}