import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schema/notification.schema';
import { Model } from 'mongoose';
import admin from './config';
import { NotificationDto } from './dto/notification.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
    private readonly userService: UsersService
  ) {}

  private async sendNotification(token: string, message: any) {
    try {
      const response = await admin.messaging().sendToDevice(token, message);
      console.log(response);
      return 'message sended';
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const notifications = await this.notificationModel.find();
      return notifications;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createNotification(data: NotificationDto) {
    try {
      const notification = new this.notificationModel(data);
      await notification.save();
      return true;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async cleanData(token: string, message: any) {
    try {
      const user = await this.userService.getByDeviceToken(token);
      return {
        title: message.tittle,
        body: message.body,
        to: user
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async testNotification(token: string) {
    try {
      const message = {
        notification: {
          title: 'Test notification',
          body: 'Are you available for my test',
          sound: 'default'
        },
        data: {
          title: 'I need test.',
          body: 'Are you available for my test',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message.notification);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendAcceptGroup(token: string) {
    try {
      const message = {
        notification: {
          title: 'Grupo aceptado',
          body: 'Fuiste aceptado al grupo',
          sound: 'default'
        },
        data: {
          title: 'Grupo aceptado',
          body: 'Fuiste aceptado al grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message.notification);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendAcceptInterGroup(token: string) {
    try {
      const message = {
        notification: {
          title: 'Inter Grupo aceptado',
          body: 'Fuiste aceptado al inter grupo',
          sound: 'default'
        },
        data: {
          title: 'Inter Grupo aceptado',
          body: 'Fuiste aceptado al inter grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message.notification);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendNewChatMessage(token: string) {
    try {
      const message = {
        notification: {
          title: 'Nuevo mensaje',
          body: 'Tienes un nuevo mensaje en un chat',
          sound: 'default'
        },
        data: {
          title: 'Nuevo mensaje',
          body: 'Tienes un nuevo mensaje en un chat',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message.notification);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
