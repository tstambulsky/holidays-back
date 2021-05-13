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
import { NotificationService } from '../notification/notification.service';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;


@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService,
    private readonly interGroupService: InterGroupService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService
  ) { }

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

  async createInterGroupMessageOne(chatId: any, userId: any) {
    try {
      const user = await this.usersService.findOneUser({ _id: userId });
      const message = await new this.messageModel({
        content: 'Ha enviado una solicitud para unirse!',
        author: user._id,
        image: user.profilePhoto,
        name: user.name,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createInterGroupMessageTwo(chatId: any, userId: any) {
    try {
      const user = await this.usersService.findOneUser({ _id: userId });
      const message = await new this.messageModel({
        content: 'Hola, nos gustaría sumarnos al plan.',
        author: user._id,
        image: user.profilePhoto,
        name: user.name,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createInterGroupMessageFour(chatId: any) {
    try {
      const message = await new this.messageModel({
        content: `¡Toque aceptado!`,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }


  async createInterGroupMessageThree(chatId: any, userId: any, group: any) {
    try {
      const user = await this.usersService.findOneUser({ _id: userId });
      const message = await new this.messageModel({
        content: `${group} han Enviado un toque!`,
        author: user._id,
        image: user.profilePhoto,
        name: user.name,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }


  async createInterGroupMessage(chatId: any, name: any) {
    try {
      const message = await new this.messageModel({
        content: `${name} han aceptado la hora y el lugar`,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createGroupMessage(chatId: any, userId: any) {
    try {
      const user = await this.usersService.findOneUser({ _id: userId });
      const message = await new this.messageModel({
        content: 'Ha enviado una solicitud para unirse!',
        author: user._id,
        image: user.profilePhoto,
        name: user.name,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createGroupMessageTwo(chatId: any, userId: any) {
    try {
      const user = await this.usersService.findOneUser({ _id: userId });
      const message = await new this.messageModel({
        content: 'Hola, me gustaría unirme al grupo',
        author: user._id,
        image: user.profilePhoto,
        name: user.name,
        chat: chatId
      })
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createGroupMessageThree(chatId: any) {
    try {
      const message = new this.messageModel({
        content: 'Tienes solicitudes de unión a grupo',
        chat: chatId
      });
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createMeetingMessage(name: any, time: any, meeting: any) {
    try {
      const message = new this.messageModel({
        content: `Juntada: Hoy a las ${time} en ${meeting}`,
        name
      });
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getMeetingMessageGroup(name: any, currentUser: any) {
    try {
      const message: any = await this.messageModel.findOne({ name: name });
      if (message.readby !== currentUser._id) {
      message.readBy.push(currentUser._id);
      }
      await message.save();
      return message;
    } catch (error) {
      throw new Error(error.message)
    }
  }


  async createGroupChat(groupId: any) {
    const group = await this.groupService.getGroup(groupId);
    const chat = await new this.chatModel({
      group: groupId,
      name: group.name,
      image: group.photo
    });
    await chat.save();
    return chat;
  }

  async getChatPopulateGroup(invitationId: any, currentUser: any) {
    try {
      let groupWithoutUserLogged;
      let groupUserOne;
      let groupUserTwo;
      const userId = currentUser._id;
      const group = await this.chatModel.findOne({ invitation: invitationId, active: true });
      if (group) {
        const invitation = await this.interGroupService.getInvitationId(invitationId);
        const isInGroup = await this.groupService.getOneUserGroup(userId, invitation.groupSender, invitation.groupReceiver);
        if (!isInGroup) throw new WsException('Your does not belong to any group');
        const existGroup = await this.groupService.getOneGroup({ _id: invitation.groupSender});
        if (existGroup) {
        groupUserOne = await this.groupService.getGroup(invitation.groupSender);
        }
        const existGroupTwo = await this.groupService.getOneGroup({ _id: invitation.groupReceiver});
        if (existGroupTwo) {
        groupUserTwo = await this.groupService.getGroup(invitation.groupReceiver);
        }
        if (groupUserOne && groupUserOne.name == isInGroup.name) {
          groupWithoutUserLogged = groupUserTwo;
        } else {
          groupWithoutUserLogged = groupUserOne;
        }
      }
      return groupWithoutUserLogged;
    } catch (error) {
      throw new Error(error.message)
    }
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
    });
    await chat.save();
    return chat;
  }

  async getChatGroupUser(currentUser: any) {
    try {
      const date = new Date();
      const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      let allChats = [];
      const groups = await this.groupService.getUserGroups(currentUser);
      for await (let group of groups) {
        const testGroup = await this.groupService.getGroup(group);
        const dateGroup = testGroup.startDate.getFullYear() + '-' + (testGroup.startDate.getMonth() + 1) + '-' + testGroup.startDate.getDate();
        await this.getUnreadGroup(group._id, currentUser);
        const invitations = await this.groupService.getInvitationToGroup(group);
        const chat = await this.chatModel.findOne({ group: group._id, active: true }).populate('lastMessage');
        if (!chat.adminUser) {
          chat.invitations = invitations.length;
          if (invitations.length > 0) {
            chat.unreadMessages += invitations.length;
          }
          if (today == dateGroup) {
            const message = await this.getMeetingMessageGroup(testGroup.name, currentUser);
            if (message) {
              chat.lastMessage = message;
            }
          }
          await chat.save();
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
      const date = new Date();
      const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      let allChats = [];
      let invitationsId = [];
      const interGroups = await this.interGroupService.getMyIntergroupsNoActives(currentUser);
      interGroups.forEach((element) => {
        invitationsId.push(element);
      });
      for await (let element of invitationsId) {
        await this.getUnreadInterGroup(currentUser, element._id);
        const interGroup = await this.interGroupService.getInterGroupByGroups(element.groupSender, element.groupReceiver);
        const chat = await this.chatModel.findOne({ invitation: element._id, active: true }).populate('lastMessage');
        if (chat) {
          const invitation = await this.interGroupService.getInvitationId(element._id);
          const group = await this.getChatPopulateGroup(element._id, currentUser);
          chat.otherGroup = group;
          if (invitation) {
            chat.unreadMessages = + 1;
          }
          if (interGroup) {
            const proposal = await this.interGroupService.getProposalsInterGroup(interGroup._id);
            if (proposal) {
              if (proposal.groupReceiver.admin == currentUser._id) {
                chat.isAdmin = true;
                await chat.save();
              } else {
                chat.isAdmin = false;
                await chat.save();
              }
            }
            if (interGroup.startDate) {
              const dateInterGroup = interGroup.startDate.getFullYear() + '-' + (interGroup.startDate.getMonth() + 1) + '-' + interGroup.startDate.getDate();
              if (today == dateInterGroup) {
                const message = await this.getMeetingMessageGroup(interGroup.name, currentUser);
                if (message) {
                  chat.lastMessage = message;
                }
              }
            }
          }
          await chat.save();
          if (chat !== null) {
            allChats.push(chat);
          }
        }
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

  async getInterGroupInactive(interGroupId: any) {
    try {
      const interGroupChat = await this.chatModel.findOne({ active: false, interGroup: interGroupId });
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
      const chats = await this.chatModel.find({ user: currentUser._id, active: true }).populate('lastMessage');
      if (!chats) throw new WsException('The user is not an admin of any group');
      for await (let chat of chats) {
        await this.getUnreadAdmin(chat._id, currentUser);
      }
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

  async getOneChatAdminUserWithout(userId: any, groupId: any) {
    try {
      const chat = await this.chatModel.findOne({ user: userId, group: groupId, active: false });
      return chat;
    } catch (error) {
      throw new Error(error);
    }
  }


  async getChatAdmin(currentUser: any) {
    try {
      const chats = await this.chatModel.find({ adminUser: currentUser._id, active: true }).populate('lastMessage');;
      if (!chats) throw new WsException('You are not the admin or the user does not exist.');
      for await (let chat of chats) {
        await this.getUnreadAdmin(chat._id, currentUser);
      }
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

  async getOneChatAdminWithUser(userId: any, user: any) {
    try {
      const chats = await this.chatModel.findOne({ adminUser: userId, user: user, active: true });
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
    let integrants = [];
    const userId = currentUser._id;
    const user = await this.usersService.getUserById(userId);
    const group: any = await this.groupService.getGroup({ active: true, integrants: userId, _id: groupId });
    if (!group) throw new WsException('Group does not exist or user does not belong to the group');
    group.integrants.forEach(element => {
      if (element._id == userId) {
        console.log('User send no need push');
      } else {
        integrants.push(element._id);
      }
    });
    const chat = await this.chatModel.findOne({ group: groupId, active: true });
    const newMessage = await new this.messageModel({
      content,
      name: user.name,
      image: user.profilePhoto,
      author: userId,
      group: chat._id,
      chat: chat._id
    });
    //@ts-ignore
    newMessage.readBy.push(userId)
    await newMessage.save();
    for await (let users of integrants) {
      const findUser = await this.usersService.findOneUser({ _id: users, active: true })
      if (findUser.deviceToken) {
        await this.notificationService.sendNewChatMessage(findUser.deviceToken, group.name);
      }
    }
    return newMessage;
  }

  async getAllMessagesGroup(groupId: any, currentUser: any) {
    let allUnread = [];
    const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: currentUser._id });
    if (!group) throw new WsException('The user does not belong to the group or the group does not exist.');
    const chat = await this.chatModel.findOne({ group: groupId, active: true });
    const messages = await this.messageModel
      .find({
        chat: chat._id
      })
      .sort({ date: 1 });
    for await (let message of messages) {
      const mesg = await this.messageModel.findOne({ _id: message._id, readBy: { $ne: currentUser._id } });
      if (mesg) {
        allUnread.push(mesg);
        //@ts-ignore
        mesg.readBy.push(currentUser._id);
        mesg.save();
      }
    }
    if (allUnread.length < 1) {
      chat.unreadMessages = 0;
      chat.lastMessage = undefined;
      await chat.save();
    }
    return messages;
  }

  async saveMessageInterGroup(content: string, currentUser: any, invitationId: any) {
    let integrantsOne = [];
    let integrantsTwo = [];
    let userInGroupTwo;
    const userId = currentUser._id;
    const user = await this.usersService.getUserById(userId);
    //const group = await this.groupService.getGroupChat(groupId, currentUser);
    //const interGroup = await this.interGroupService.getInterGroupInactive(interGroupId);
    //if (!interGroup) throw new WsException('The intergroup does not exist.');
    const invitation = await this.interGroupService.getInvitationId(invitationId);
    const groupOne: any = invitation.groupSender;
    groupOne.integrants.forEach(element => {
      if (element._id == userId) {
        console.log('User send no need push');
      } else {
        integrantsOne.push(element._id);
      }
    });
    const groupTwo: any = invitation.groupReceiver;
    groupTwo.integrants.forEach(element => {
      if (element._id == userId) {
        console.log('User send no need push');
      } else {
        integrantsTwo.push(element._id);
      }
    });
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
    //@ts-ignore
    newMessage.readBy.push(userId)
    await newMessage.save();
    for await (let users of integrantsOne) {
      const user = await this.usersService.findOneUser({ _id: users, active: true });
      if (user.deviceToken) {
        await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
      }
    }
    for await (let users of integrantsTwo) {
      const user = await this.usersService.findOneUser({ _id: users, active: true });
      if (user.deviceToken) {
        await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
      }
    }
    return newMessage;
  }

  async getAllMessagesInterGroup(currentUser: any, invitationId: any) {
    let allUnread = [];
    const userId = currentUser._id;
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
    const messages = await this.messageModel
      .find({
        chat: chat._id
      })
      .sort({ date: 1 });
    for await (let message of messages) {
      const mesg: any = await this.messageModel.findOne({ _id: message._id, readBy: { $ne: currentUser._id } });
      //@ts-ignore
      if (mesg) {
        allUnread.push(mesg);
        mesg.readBy.push(userId);
        mesg.save();
      }
    }
    if (allUnread.length < 1) {
      chat.unreadMessages = 0;
      chat.lastMessage = undefined;
      await chat.save();
    }
    return messages;
  }

  async saveMessageAdmin(content: string, chatId: any, groupId: any, currentUser: any) {
    const userId = currentUser._id;
    const userExist = await this.usersService.getUserById(userId);
    if (!userExist) throw new WsException('User does not exist');
    const chat: any = await this.chatModel.findOne({ _id: chatId, active: true }).populate('adminUser').populate('user');
    if (!chat) throw new WsException('Chat does not exist');
    const group = await this.groupService.getGroupAdmin(groupId, chat.adminUser._id);
    const newMessage = await new this.messageModel({
      content,
      name: userExist.name,
      image: userExist.profilePhoto,
      group: groupId,
      author: userId,
      chat: chat._id
    });
    //@ts-ignore
    newMessage.readBy.push(userId)
    await newMessage.save();
    if (chat.adminUser._id == userId) {
      const user = await this.usersService.findOneUser({ _id: chat.user._id, active: true })
      if (user.deviceToken) {
        await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
      }
    }
    if (chat.adminUser._id != userId) {
      const user = await this.usersService.findOneUser({ _id: chat.adminUser._id, active: true })
      if (user.deviceToken) {
        await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
      }
    }
    return newMessage;
  }

  async getAllMessagesAdmin(chatId: any, currentUser: any) {
    let allUnread = [];
    const chat = await this.chatModel.findOne({ _id: chatId, active: true });
    const id = chat._id;
    const messages = await this.messageModel
      .find({
        chat: id
      })
      .sort({ date: 1 });
    for await (let message of messages) {
      const mesg = await this.messageModel.findOne({ _id: message._id, readBy: { $ne: currentUser._id } })
      if (mesg) {
        allUnread.push(mesg);
        //@ts-ignore
        mesg.readBy.push(currentUser._id);
        mesg.save();
      }
    }
    if (allUnread.length < 1) {
      chat.unreadMessages = 0;
      chat.lastMessage = undefined;
      await chat.save();
    }
    return messages;
  }

  async getUnreadGroup(groupId: any, currentUser: any) {
    try {
      let integrants = [];
      const group = await this.groupService.getGroup({ active: true, _id: groupId, integrants: currentUser._id });
      if (!group) throw new WsException('The user does not belong to the group or the group does not exist.');
      integrants.push(group.integrants);
      const chat: any = await this.chatModel.findOne({ group: groupId, active: true });
      const messages = await this.messageModel
        .find({
          chat: chat._id,
          readBy: { $ne: currentUser._id }
        })
        .sort({ date: 1 });
      if (messages.length > 0) {
        chat.unreadMessages = messages.length;
        chat.lastMessage = messages[0]._id;
        await chat.save();
      }
      /*for await (let users of integrants) {
        const user = await this.usersService.findOneUser({ _id: users, active: true })
        if (user.deviceToken) {
        await this.notificationService.sendNewChatMessage(users.deviceToken, group.name);
      }
    }*/
      return messages;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUnreadInterGroup(currentUser: any, invitationId: any) {
    try {
      let userInGroupTwo;
      let integrantsOne = [];
      let integrantsTwo = [];
      let allMessages = [];
      //const group = await this.groupService.getGroupChat(groupId, currentUser);
      //const interGroup = await this.interGroupService.getInterGroupInactive(interGroupId);
      //if (!interGroup) throw new WsException('The intergroup does not exist.');
      /*const invitation = await this.interGroupService.getInvitationId(invitationId);
      const groupOne = invitation.groupSender;
      if (groupOne.integrants) {
      integrantsOne.push(groupOne.integrants);
      }
      const groupTwo = invitation.groupReceiver;
      if (groupTwo.integrants) {
      integrantsTwo.push(groupTwo.integrants);
      }
      if (groupOne.integrants && groupTwo.integrants) {
      const userInGroup = await this.groupService.getOneUserWithGroup(currentUser, groupOne);
      if (userInGroup === null) userInGroupTwo = await this.groupService.getOneUserWithGroup(currentUser, groupTwo);
      }*/
      //if (userInGroupTwo === null) throw new WsException('The user does not belong to some group');
      const chat: any = await this.chatModel.findOne({ invitation: invitationId, active: true }).populate('interGroup').populate('lastMessage');
      if (chat) {
        const messages = await this.messageModel
          .find({
            chat: chat._id,
            readBy: { $ne: currentUser._id }
          })
          .sort({ date: 1 });
        allMessages.push(messages);
        if (messages.length > 0) {
          chat.unreadMessages = messages.length;
          chat.lastMessage = messages[0]._id;
          await chat.save();
        }
      }
      /*for await (let users of integrantsOne) {
        const user = await this.usersService.findOneUser({_id: users, active: true});
        if (user.deviceToken) {
        await this.notificationService.sendNewChatMessage(users.deviceToken, chat.interGroup.name);
      }
    }
       for await (let users of integrantsTwo) {
         const user = await this.usersService.findOneUser({_id: users, active: true});
         if (users.deviceToken) {
        await this.notificationService.sendNewChatMessage(users.deviceToken, chat.interGroup.name);
         }
      }*/
      return allMessages;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUnreadAdmin(chatId: any, currentUser: any) {
    try {
      const chat: any = await this.chatModel.findOne({ _id: chatId, active: true });
      if (!chat) throw new WsException('Chat does not exist, id incorrect or group inactive.');
      const id = chat._id;
      const messages = await this.messageModel
        .find({
          chat: id,
          readBy: { $ne: currentUser._id }
        })
        .sort({ date: 1 });
      if (messages.length > 0) {
        chat.unreadMessages = messages.length;
        chat.lastMessage = messages[0]._id;
        await chat.save();
      }
      /*if (user.deviceToken) {
      await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
      }*/
      return messages;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllChats(currentUser: any) {
    try {
      const userId = currentUser._id;
      let allChats = [];
      const group = await this.getChatGroupUser(userId);
      if (group) {
      allChats.push(group);
      }
      const interGroup = await this.getChatInterGroupsUser(userId);
      if (interGroup) {
      allChats.push(interGroup);
      }
      const admin = await this.getChatAdmin(userId);
      if (admin) {
      allChats.push(admin);
      }
      const userToAdmin = await this.getChatAdminUser(userId);
      if (userToAdmin) {
      allChats.push(userToAdmin);
      }
      return allChats;
    } catch (error) {
      throw new Error(error);
    }
  }
}
