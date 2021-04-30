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

  async sendNotification(token: string, message: any) {
    try {
      const response = await admin.messaging().sendToDevice(token, message);
      console.log(response);
      return 'message sended';
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getNotifications(currentUser: any ): Promise<Notification[]> {
    try {
      const userId = currentUser._id;
      const notifications = await this.notificationModel.find({ to: userId, message: false });
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
      return notification;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async cleanData(token: string, message: any) {
    try {
      const user = await this.userService.getByDeviceToken(token);
      return {
        title: message.data.title,
        body: message.data.body,
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

  async sendAcceptGroup(token: string, name: any) {
    try {
      const message = {
        notification: {
          title: 'Grupo aceptado',
          body: `Fuiste aceptado al grupo ${name}`,
          sound: 'default'
        },
        data: {
          title: 'Grupo aceptado',
          body: `Fuiste aceptado al grupo ${name}`,
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

  async sendNoAcceptGroup(token: string, name: any) {
    try {
      const message = {
        notification: {
          title: 'Grupo no aceptado',
          body: `No fuiste aceptado al grupo ${name}`,
          sound: 'default'
        },
        data: {
          title: 'Grupo no aceptado',
          body: `No fuiste aceptado al grupo ${name}`,
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

  async sendUserAccept(token: string, name: any, group: any) {
    try {
      const message = {
        notification: {
          title: 'Solicitud de grupo aceptada',
          body: `El usuario ${name} ha aceptado la invitación al grupo ${group}`,
          sound: 'default'
        },
        data: {
          title: 'Solicitud de grupo aceptada',
          body: `El usuario ${name} ha aceptado la invitación al grupo ${group}`,
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

  async sendUserNoAccept(token: string, name: any, group: any) {
    try {
      const message = {
        notification: {
          title: 'Solicitud de grupo no aceptada',
          body: `El usuario ${name} no ha aceptado la invitación al grupo ${group}`,
          sound: 'default'
        },
        data: {
          title: 'Solicitud de grupo no aceptada',
          body: `El usuario ${name} no ha aceptado la invitación al grupo ${group}`,
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


  async sendInvitationGroupToUser(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Invitacion de grupo',
          body: `Has sido invitado al grupo ${group}`,
          sound: 'default'
        },
        data: {
          title: 'Invitacion de grupo',
          body:  `Has sido invitado al grupo ${group}`,
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

  async sendInvitationToAdmin(token: string, name: any, group: any) {
    try {
      const message = {
        notification: {
          title: 'Solicitud de unión a grupo',
          body:  `El usuario ${name} quiere unirse al grupo ${group}`,
          sound: 'default'
        },
        data: {
          title: 'Solicitud de unión a grupo',
          body: `El usuario ${name} quiere unirse al grupo ${group}`,
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

   async sendInvitationToInterGroup(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Invitación a Inter Grupo',
          body: `El grupo ${group} quiere formar un Inter Grupo!`,
          sound: 'default'
        },
        data: {
          title: 'Invitación a Inter Grupo',
          body: `El grupo ${group} quiere formar un Inter Grupo!`,
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

   async sendAcceptInterGroup(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Inter Grupo aceptado',
          body: `El grupo ${group} aceptó la invitación al inter grupo,`,
          sound: 'default'
        },
        data: {
          title: 'Inter Grupo aceptado',
          body: `El grupo ${group} aceptó la invitación al inter grupo,`,
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

   async sendNoAcceptInterGroup(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Inter Grupo no aceptado',
          body: `El grupo ${group} no aceptó la invitación al inter grupo,`,
          sound: 'default'
        },
        data: {
          title: 'Inter Grupo no aceptado',
          body: `El grupo ${group} no aceptó la invitación al inter grupo,`,
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

  async sendProposal(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Propuesta de juntada',
          body: `El grupo ${group} ha enviado una propuesta de juntada!`,
          sound: 'default'
        },
        data: {
          title: 'Propuesta de juntada',
          body: `El grupo ${group} ha enviado una propuesta de juntada!`,
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

  async sendAcceptProposal(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Propuesta de juntada',
          body: `El grupo ${group} ha aceptado la propuesta de juntada!`,
          sound: 'default'
        },
        data: {
          title: 'Propuesta de juntada',
          body: `El grupo ${group} ha aceptado la propuesta de juntada!`,
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

   async sendNoAcceptPropoasl(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Propuesta de juntada',
          body: `El grupo ${group} no ha aceptado la propuesta de juntada`,
          sound: 'default'
        },
        data: {
          title: 'Propuesta de juntada',
          body: `El grupo ${group} no ha aceptado la propuesta de juntada`,
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

  async sendNewChatMessage(token: string, group: any) {
    try {
      const message = {
        notification: {
          title: 'Tienes mensajes nuevos sin leer',
          body: `Nuevos mensajes en ${group}`,
          sound: 'default'
        },
        data: {
          title: 'Tienes mensajes nuevos sin leer',
          body: `Nuevos mensajes en ${group}`,
          Emergency_category: 'Emergency'
        }
      };
      await this.sendNotification(token, message);
      const notification = await this.cleanData(token, message);
      const msg = await this.createNotification(notification);
      msg.message = true;
      await msg.save()
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
