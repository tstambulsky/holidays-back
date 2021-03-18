import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { UsersService } from '../users/users.service';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema'
import { Chat, ChatDocument } from './schema/chat.schema';
import { GroupService } from '../group/group.service';
import { InterGroupService } from '../inter-group/interGroup.service';
import { ContactsController } from '../contacts/contacts.controller';

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService, @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService, private readonly interGroupService: InterGroupService, private readonly usersService: UsersService) { }

async getUserFromSocket(socket: Socket) {
    const authenticationToken = socket.handshake.headers.authentication != null ? socket.handshake.headers.authentication : socket.request.headers.authentication;
    if (!authenticationToken) throw new WsException('JWT not provided in the authentication header');
    const user = await this.authService.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async createGroupChat(groupId: any) {
    const group = await this.groupService.getGroup(groupId);
    if (!group) throw new WsException('Group does not exist')
    const chat = await new this.chatModel({
      group: groupId,
    });
    return await chat.save();
  }

  async createInterGroupChat(interGroupId: any) {
    const interGroup = await this.interGroupService.getInterGroup(interGroupId)
    if (!interGroupId) throw new WsException('InterGroup does not exist')
    const chat = await new this.chatModel({
      interGroup: interGroupId
    })
    return await chat.save();
  }

  async createAdminChat(groupId: any) {
    const group = await this.groupService.getGroup(groupId);
    if (!group) throw new WsException('Group does not exist');
    const chat = await new this.chatModel({
      adminUser: group.admin,
    });
    return await chat.save();
  }

  async getChatGroupUser(currentUser: any) {
    try {
      let allChats = [];
      const groups = await this.groupService.getUserGroups(currentUser)
      for await (let group of groups) {
        console.log(group.id);
        const chat = await this.chatModel.find({ group: group._id })
        if (chat) {
          allChats.push(chat)
        }
      }
      const chats = allChats.filter(data => !!data);
      return chats;
    } catch (error) {
      throw new Error(error)
    }
  }

  async getChatInterGroupsUser(currentUser: any) {
    try {
      let allChats = [];
      let interGroupsId = [];
      const interGroups = await this.interGroupService.getMyIntergroupsNoActives(currentUser);
      console.log('intergroupsasd', interGroups)
      interGroups.forEach((element) => {
        interGroupsId.push(element.searchInterGroups._id)
      });
      for await (let element of interGroupsId) {
        const chat = await this.chatModel.findOne({ interGroup: element._id });
        if (chat !== null) await allChats.push(chat);
      }
      return allChats;
    } catch (error) {
      throw new Error(error)
    }
  }

  async getChatAdmin(groupId: any) {
    try {
      const group = await this.groupService.getGroup(groupId);
      return await this.chatModel.find({ adminUser: group.admin })
    } catch (error) {
      throw new Error(error)
    }
  }

  async saveMessageGroup(content: string, currentUser: any, groupId: any) {
    const userId = currentUser._id;
    const group = await this.groupService.getGroup({ active: true, integrants: userId, _id: groupId })
    if (!group) throw new WsException('Group does not exist or user does not belong to the group')
    const chat = await this.chatModel.findOne({ group: groupId })
    const newMessage = await new this.messageModel({
      content,
      author: userId,
      group: chat._id
    });
    await newMessage.save();
    return newMessage
  }

  async getAllMessagesGroup(groupId: any, currentUser: any) {
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: currentUser._id });
    if (!group) throw new WsException('The user does not belong to the group or the group does not exist.');
    const chat = await this.chatModel.findOne({ group: groupId })
    return this.messageModel.find({
      chat: chat._id,
      relations: ['author']
    }).sort({ datefield: -1 });
  }

  async saveMessageInterGroup(content: string, currentUser: any, groupId: any, interGroupId: any) {
    const userId = currentUser._id;
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: userId })
    const interGroup = await this.interGroupService.getInterGroup({ active: true, $or: [{ groupOne: groupId }, { groupTwo: groupId }] });
    if (!interGroup) throw new WsException('The user does not belong to the intergroup or the intergroup does not exist.')
    const chat = await this.chatModel.findOne({ _id: interGroupId });
    const newMessage = await new this.messageModel({
      content,
      author: userId,
      chat: chat._id
    });
    return await newMessage.save();
  }


  async getAllMessagesInterGroup(currentUser: any, groupId: any, interGroupId: any) {
    const userId = currentUser._id;
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: userId })
    const interGroup = await this.interGroupService.getInterGroup({ active: true, $or: [{ groupOne: groupId }, { groupTwo: groupId }] });
    if (!interGroup) throw new WsException('The user does not belong to the intergroup or the intergroup does not exist.')
    const chat = await this.chatModel.findOne({ interGroup: interGroupId })
    return this.messageModel.find({
      interGroup: interGroupId,
      relations: ['author']
    }).sort({ datefield: -1 });
  }

  async saveMessageAdmin(content: string, currentUser: any, admin: any, groupId: any) {
    const group = await this.groupService.getGroup({ active: true, admin });
    if (!group) throw new WsException('The group does not exist');
    const chat = await this.chatModel.findOne({ adminUser: currentUser._id })
    const newMessage = await new this.messageModel({
      content,
      author: currentUser._id,
      chat: chat._id,
    });
    return await newMessage.save();
  }

  async getAllMessagesAdmin(admin: any, groupId: any) {
    const group = await this.groupService.getGroup({ active: true, _id: groupId, admin })
    if (!group) throw new WsException('The group does not exist or you are not the admin of the group');
    const chat = await this.chatModel.findOne({ adminUser: admin, group: groupId })
    return this.messageModel.find({
      chat: chat._id,
      relations: ['author']
    }).sort({ datefield: -1 });
  }
}
