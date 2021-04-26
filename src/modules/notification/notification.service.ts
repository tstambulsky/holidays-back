import { Injectable, forwardRef, Inject } from '@nestjs/common';
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
    @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService
  ) {}

  async sendNotification(token: string, payload: any) {
    try {
      const response = await admin.messaging().sendToDevice(token, payload);
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
      await this.sendNotification(token, message);
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
          body: 'Fuiste aceptado a un grupo',
          sound: 'default'
        },
        data: {
          title: 'Grupo aceptado',
          body: 'Fuiste aceptado a un grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendNoAcceptGroup(token: string) {
    try {
      const message = {
        notification: {
          title: 'Grupo no aceptado',
          body: 'No fuiste aceptado al grupo',
          sound: 'default'
        },
        data: {
          title: 'Grupo no aceptado',
          body: 'No fuiste aceptado al grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendInvitationGroupToUser(token: string) {
    try {
      const message = {
        notification: {
          title: 'Invitacion de grupo',
          body: 'Fuiste invitado a un grupo',
          sound: 'default'
        },
        data: {
          title: 'Invitacion de grupo',
          body:  'Fuiste invitado a un grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendInvitationToAdmin(token: string) {
    try {
      const message = {
        notification: {
          title: 'Solicitud de unión a grupo',
          body:  'Un usuario quiere unirse a tu grupo',
          sound: 'default'
        },
        data: {
          title: 'Solicitud de unión a grupo',
          body: 'Un usuario quiere unirse a tu grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

   async sendInvitationToInterGroup(token: string) {
    try {
      const message = {
        notification: {
          title: 'Invitación a Inter Grupo',
          body: 'Un grupo quiere formar un Inter Grupo!',
          sound: 'default'
        },
        data: {
          title: 'Invitación a Inter Grupo',
          body: 'Un grupo quiere formar un Inter Grupo!',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
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
          body: 'Un grupo aceptó la invitación al inter grupo!',
          sound: 'default'
        },
        data: {
          title: 'Inter Grupo aceptado',
          body: 'Un grupo aceptó la invitación al inter grupo!',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

   async sendNoAcceptInterGroup(token: string) {
    try {
      const message = {
        notification: {
          title: 'Inter Grupo no aceptado',
          body: 'El grupo no aceptó la invitación al inter grupo',
          sound: 'default'
        },
        data: {
          title: 'Inter Grupo no aceptado',
          body: 'El grupo no aceptó la invitación al inter grupo',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendProposal(token: string) {
    try {
      const message = {
        notification: {
          title: 'Propuesta de juntada',
          body: 'El otro grupo ha enviado una propuesta de juntada!',
          sound: 'default'
        },
        data: {
          title: 'Propuesta de juntada',
          body: 'El otro grupo ha enviado una propuesta de juntada!',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendAcceptProposal(token: string) {
    try {
      const message = {
        notification: {
          title: 'Propuesta de juntada',
          body: 'El otro grupo ha aceptado la propuesta de juntada!',
          sound: 'default'
        },
        data: {
          title: 'Propuesta de juntada',
          body: 'El otro grupo ha aceptado la propuesta de juntada!',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

   async sendNoAcceptPropoasl(token: string ) {
    try {
      const message = {
        notification: {
          title: 'Propuesta de juntada',
          body: 'El otro grupo no ha aceptado la propuesta de juntada',
          sound: 'default'
        },
        data: {
          title: 'Propuesta de juntada',
          body:  'El otro grupo no ha aceptado la propuesta de juntada',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
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
          title: 'Mensajes nuevos',
          body: 'Tienes nuevos mensajes sin leer!',
          sound: 'default'
        },
        data: {
          title: 'Mensajes nuevos',
          body: 'Tienes nuevos mensajes sin leer!',
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      await this.createNotification(notification);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
