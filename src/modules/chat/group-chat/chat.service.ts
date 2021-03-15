import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { GroupService } from '../../group/group.service';
import { InterGroupService } from '../../inter-group/interGroup.service';

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService, @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  private readonly groupService: GroupService, private readonly interGroupService: InterGroupService) {}

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

  async getAllMessagesGroup(groupId: any, currentUser: any) {
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: currentUser._id});
    if (!group) throw new HttpException('The user does not belong to the group or the group does not exist.', 404);
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

  async getAllMessagesInterGroup(interGroupId: any, groupId: any, currentUser: any) {
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: currentUser._id});
    if (!group) throw new HttpException('The user does not belong to the group or the group does not exist.', 404);
    const interGroup = await this.interGroupService.getInterGroup({active: true, $or: [{groupOne: groupId}, {groupTwo: groupId}]});
    if (!interGroup) throw new HttpException('The intergroup does not exist or the group does not belong to this intergroup', 404);
    return this.messageModel.find({
      interGroup: interGroupId,
      relations: ['author']
    });
  }
   async saveMessageAdmin(content: string, currentUser: any, admin: any, groupId: any) {
    const userId = currentUser._id;
    const newMessage = await new this.messageModel({
      content,
      author: userId,
      groupId,
      admin: admin
    });
    return await newMessage.save();
  }

  async getAllMessagesUser(admin: any, groupId: any) {
    const group = await this.groupService.getGroup({active: true, _id: groupId, admin})
    if (!group) throw new HttpException('The group does not exist or you are not the admin of the group', 404);
    return this.messageModel.find({
      admin,
      groupId,
      relations: ['author']
    });
  }
}
