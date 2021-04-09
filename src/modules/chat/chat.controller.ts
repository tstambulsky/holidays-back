import { Controller, Get, Res, HttpStatus, Body, Post, UseGuards} from '@nestjs/common';
import { CurrentUser } from 'src/modules/users/decorators/currentUser';
import { MessageDTO } from './dto/message.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/chat')
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

  @Get('/adminuser/')
  async getUserAdminChat(@Res() res,@CurrentUser() user) {
    try {
      const response = await this.chatService.getChatAdmin(user)
      res.status(HttpStatus.OK).json({
        response
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  };

  @Get('/usertoadmin/')
  async getAdminChat(@Res() res, @CurrentUser() user) {
    try {
      const response = await this.chatService.getChatAdminUser(user)
      res.status(HttpStatus.OK).json({
        response
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  };

  @Post('/sendgroup')
  async sendmessagegroup(@Res() res, @Body() data: MessageDTO, @CurrentUser() user) {
    try {
      const response = await this.chatService.saveMessageGroup(data.content, user, data.group);
      res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

   @Get('/savegroup')
  async savemessagegroup(@Res() res, @Body() data: MessageDTO, @CurrentUser() user) {
    try {
      const response = await this.chatService.getAllMessagesGroup(data.group, user);
      res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

  @Post('/sendintergroup')
  async sendmessageintergroup(@Res() res, @Body() data: MessageDTO, @CurrentUser() user) {
    try {
      const response = await this.chatService.saveMessageInterGroup(data.content, user, data.invitation);
      res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

   @Get('/saveintergroup')
  async savemessageintergroup(@Res() res, @Body() data: MessageDTO, @CurrentUser() user) {
    try {
      const response = await this.chatService.getAllMessagesInterGroup(user, data.invitation);
      res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

  @Post('/sendadmin')
  async sendmessageadmin(@Res() res, @Body() data: MessageDTO,@CurrentUser() user) {
    try {
      const response = await this.chatService.saveMessageAdmin(data.content, data.chatId, data.group, user);
      res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

   @Get('/saveadmin')
  async savemessageadmin(@Res() res, @Body() data: MessageDTO) {
    try {
      const response = await this.chatService.getAllMessagesAdmin(data.chatId);
      res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: err.message
      });
    }
  }

}