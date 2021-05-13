import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/currentUser';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Notification } from './schema/notification.schema';

@UseGuards(JwtAuthGuard)
@Controller('/api/notifications')
export class NotificationController {
 constructor(private readonly notificationService: NotificationService) {}

@Get('/user')
  async getNotificationsUser(@Res() res,@CurrentUser() user): Promise<Notification[]> {
    try {
      const notifications = await this.notificationService.getNotifications(user);
      return res.status(HttpStatus.OK).json({
        message: 'List of Notifications',
        notifications
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }
}