import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService, @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async saveMessageGroup(content: string, currentUser: any, groupId: any) {
    const userId = currentUser._id;
    const newMessage = await new this.messageModel({
      content,
      author: userId,
      group: groupId
    });
    return await newMessage.save();
  }

  async getAllMessagesGroup(groupId: any) {
    return this.messageModel.find({
      group: groupId,
      relations: ['author']
    });
  }
   async saveMessageInterGroup(content: string, currentUser: any, interGroupId: any) {
    const userId = currentUser._id;
    const newMessage = await new this.messageModel({
      content,
      author: userId,
      intergroup: interGroupId
    });
    return await newMessage.save();
  }

  async getAllMessagesInterGroup(interGroupId: any) {
    return this.messageModel.find({
      interGroup: interGroupId,
      relations: ['author']
    });
  }
   async saveMessageAdmin(content: string, currentUser: any, admin: any) {
    const userId = currentUser._id;
    const newMessage = await new this.messageModel({
      content,
      author: userId,
      admin: admin
    });
    return await newMessage.save();
  }

  async getAllMessagesUser(admin: any) {
    return this.messageModel.find({
      admin: admin,
      relations: ['author']
    });
  }
}
