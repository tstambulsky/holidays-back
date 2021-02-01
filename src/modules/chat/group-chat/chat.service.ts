import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../../message/schema/message.schema';
import { User } from '../../users/schema/users.schema';

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

  async saveMessage(content: string, author: User) {
    const newMessage = await new this.messageModel({
      content,
      author
    });
    return await newMessage.save();
  }

  async getAllMessages() {
    return this.messageModel.find({
      relations: ['author']
    });
  }
}
