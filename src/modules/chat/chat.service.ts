import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { Chat, ChatDocument } from './schema/chat.schema';
import { GroupService } from '../group/group.service';
import { InterGroupService } from '../inter-group/interGroup.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService,
    private readonly interGroupService: InterGroupService,
    private readonly usersService: UsersService
  ) {}

  async getUserFromSocket(socket: Socket) {
    const authenticationToken =
      socket.handshake.headers.authentication != null ? socket.handshake.headers.authentication : socket.request.headers.authentication;
    if (!authenticationToken) throw new WsException('JWT not provided in the authentication header');
    const user = await this.authService.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async createGroupChat(groupId: any) {
    const group = await this.groupService.getGroup(groupId);
    const chat = await new this.chatModel({
      group: groupId,
      name: group.name
    }).save();
    return chat;
  }

  async createInterGroupChat(interGroupId: any) {
    const interGroup = await this.interGroupService.getInterGroup(interGroupId);
    if (!interGroupId) throw new WsException('InterGroup does not exist');
    const chat = await new this.chatModel({
      interGroup: interGroupId
    }).save();
    return chat;
  }

  async createInterGroupChatInvitation(invitationId: any) {
    const chat = await new this.chatModel({
      invitation: invitationId,
      pending: true,
      setTimeAndPlace: false
    }).save();
    return chat;
  }

  async createAdminChat(groupId: any, userExist: any) {
    const group = await this.groupService.getGroup(groupId);
    const chat = await new this.chatModel({
      group: groupId,
      adminUser: group.admin,
      name: `${userExist.name} ${userExist.lastName} + Admin chat of ${group.name}`,
      user: userExist._id
    }).save();
    return chat;
  }

  async getChatGroupUser(currentUser: any) {
    try {
      let allChats = [];
      const groups = await this.groupService.getUserGroups(currentUser);
      for await (let group of groups) {
        const chat = await this.chatModel.find({ group: group._id, active: true });
        if (chat) {
          allChats.push(chat);
        }
      }
      const chats = allChats.filter((data) => !!data);
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChatbyGroup(groupId: any) {
    try {
      const chat = await this.chatModel.findOne({ group: groupId });
      if (!chat) throw new WsException('Chat does not exist!');
      return chat;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChatInterGroupsUser(currentUser: any) {
    try {
      let allChats = [];
      let interGroupsId = [];
      const interGroups = await this.interGroupService.getMyIntergroupsNoActives(currentUser);
      interGroups.forEach((element) => {
        interGroupsId.push(element.searchInterGroups._id);
      });
      for await (let element of interGroupsId) {
        const chat = await this.chatModel.findOne({ invitation: element._id, active: true });
        if (chat !== null) allChats.push(chat);
      }
      return allChats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getInterGroup(interGroupId: any) {
    try {
      const interGroupChat = await this.chatModel.findOne({ active: true, interGroup: interGroupId });
      if (!interGroupChat) throw new WsException('Chat does not exist');
      return interGroupChat;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getInterGroupByInvitation(invitationId: any) {
    try {
      const interGroupChat = await this.chatModel.findOne({ active: true, invitation: invitationId });
      if (!interGroupChat) throw new WsException('Chat does not exist');
      return interGroupChat;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChatAdminUser(currentUser: any) {
    try {
      const chats = await this.chatModel.find({ user: currentUser._id, active: true });
      if (!chats) throw new WsException('The user is not an admin of any group');
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOneChatAdminUser(userId: any, groupId: any) {
    try {
      const chats = await this.chatModel.findOne({ user: userId, group: groupId, active: true });
      if (!chats) throw new WsException('The user does not have chats with any admin');
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChatAdmin(currentUser: any) {
    try {
      const chats = await this.chatModel.find({ adminUser: currentUser._id, active: true });
      if (!chats) throw new WsException('You are not the admin or the user does not exist.');
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOneChatAdmin(userId: any, groupId: any) {
    try {
      const chats = await this.chatModel.findOne({ adminUser: userId, group: groupId, active: true });
      if (!chats) throw new WsException('You are not the admin or the user does not exist.');
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChatUserAdmin(currentUser: any, user: any) {
    try {
      const chats = await this.chatModel.findOne({ adminUser: user, user: currentUser._id, active: true });
      if (!chats) throw new WsException('You do not have chats with this admin');
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveMessageGroup(content: string, currentUser: any, groupId: any) {
    const userId = currentUser._id;
    const user = await this.usersService.getUserById(userId);
    const group = await this.groupService.getGroup({ active: true, integrants: userId, _id: groupId });
    if (!group) throw new WsException('Group does not exist or user does not belong to the group');
    const chat = await this.chatModel.findOne({ group: groupId, active: true });
    const newMessage = await new this.messageModel({
      content,
      name: user.name,
      image: user.profilePhoto,
      author: userId,
      group: chat._id,
      chat: chat._id
    });
    await newMessage.save();
    return newMessage;
  }

  async getAllMessagesGroup(groupId: any, currentUser: any) {
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: currentUser._id });
    if (!group) throw new WsException('The user does not belong to the group or the group does not exist.');
    const chat = await this.chatModel.findOne({ group: groupId, active: true });
    const messages = await this.messageModel
      .find({
        chat: chat._id
      })
      .sort({ date: -1 });
    return messages;
  }

  async saveMessageInterGroup(content: string, currentUser: any, invitationId: any) {
    let userInGroupTwo;
    const userId = currentUser._id;
    const user = await this.usersService.getUserById(userId);
    //const group = await this.groupService.getGroupChat(groupId, currentUser);
    //const interGroup = await this.interGroupService.getInterGroupInactive(interGroupId);
    //if (!interGroup) throw new WsException('The intergroup does not exist.');
    const invitation = await this.interGroupService.getInvitationId(invitationId);
    const groupOne = invitation.groupSender;
    const groupTwo = invitation.groupReceiver;
    const userInGroup = await this.groupService.getOneUserWithGroup(currentUser, groupOne);
    if (userInGroup === null) userInGroupTwo = await this.groupService.getOneUserWithGroup(currentUser, groupTwo);
    if (userInGroupTwo === null) throw new WsException('The user does not belong to some group');
    const chat = await this.chatModel.findOne({ invitation: invitationId, active: true });
    const newMessage = await new this.messageModel({
      content,
      name: user.name,
      image: user.profilePhoto,
      author: userId,
      chat: chat._id
    });
    return await newMessage.save();
  }

  async getAllMessagesInterGroup(currentUser: any, invitationId: any) {
    let userInGroupTwo;
    //const group = await this.groupService.getGroupChat(groupId, currentUser);
    //const interGroup = await this.interGroupService.getInterGroupInactive(interGroupId);
    //if (!interGroup) throw new WsException('The intergroup does not exist.');
    const invitation = await this.interGroupService.getInvitationId(invitationId);
    const groupOne = invitation.groupSender;
    const groupTwo = invitation.groupReceiver;
    const userInGroup = await this.groupService.getOneUserWithGroup(currentUser, groupOne);
    if (userInGroup === null) userInGroupTwo = await this.groupService.getOneUserWithGroup(currentUser, groupTwo);
    if (userInGroupTwo === null) throw new WsException('The user does not belong to some group');
    const chat = await this.chatModel.findOne({ invitation: invitationId, active: true });
    return await this.messageModel
      .find({
        chat: chat._id
      })
      .sort({ date: -1 });
  }

  async saveMessageAdmin(content: string, chatId: any, groupId: any, currentUser: any) {
    const userId = currentUser._id;
    const userExist = await this.usersService.getUserById(userId);
    if (!userExist) throw new WsException('User does not exist');
    const chat = await this.chatModel.findOne({ _id: chatId, active: true });
    if (!chat) throw new WsException('Chat does not exist');
    const group = await this.groupService.getGroupAdmin(groupId, chat.adminUser);
    if (!group) throw new WsException('The group does not exist');
    const newMessage = await new this.messageModel({
      content,
      name: userExist.name,
      image: userExist.profilePhoto,
      group: groupId,
      author: userId,
      chat: chat._id
    });
    return await newMessage.save();
  }

  async getAllMessagesAdmin(chatId: any) {
    const chat = await this.chatModel.findOne({ _id: chatId, active: true });
    const id = chat._id;
    return await this.messageModel
      .find({
        chat: id
      })
      .sort({ date: -1 });
  }
}
