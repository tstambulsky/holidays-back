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

  async createGroupChat(groupId: any) {
    const group = await this.groupService.getGroup(groupId);
    const chat = await new this.chatModel({
      group: groupId,
      name: group.name
    }).save();
    return chat;
  }

  async getChatPopulateGroup(invitationId: any, currentUser: any) {
    try {
    let groupWithoutUserLogged;
    const userId = currentUser._id;
    const group = await this.chatModel.findOne({invitation: invitationId, active: true});
    if (group) {
    const invitation = await this.interGroupService.getInvitationId(invitationId);
    const isInGroup = await this.groupService.getOneUserGroup(userId, invitation.groupSender, invitation.groupReceiver);
    if (!isInGroup) throw new WsException('Your does not belong to any group');
    const groupUserOne: any = await this.groupService.getGroup(invitation.groupSender);
    const groupUserTwo: any = await this.groupService.getGroup(invitation.groupReceiver);
    if (groupUserOne.name == isInGroup.name) {
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
      let allChats = [];
      const groups = await this.groupService.getUserGroups(currentUser);
      for await (let group of groups) {
        await this.getUnreadGroup(group._id, currentUser);
        const chat = await this.chatModel.findOne({ group: group._id, active: true }).populate('lastMessage');
        if (!chat.adminUser) {
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
      let invitationsId = [];
      const interGroups = await this.interGroupService.getMyIntergroupsNoActives(currentUser);
      interGroups.forEach((element) => {
        invitationsId.push(element._id);
      });
      for await (let element of invitationsId) {
        await this.getUnreadInterGroup(currentUser, element);
        const chat = await this.chatModel.findOne({ invitation: element, active: true }).populate('lastMessage');
        if (chat) {
        const group = await this.getChatPopulateGroup(element._id, currentUser);
        chat.otherGroup = group;
        chat.save();
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
      integrants.push(element._id)
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
    console.log(integrants.length);
      if (integrants.length > 0) {
     for await (let users of integrants) {
          const user = await this.usersService.findOneUser({ _id: users, active: true })
          if (user.deviceToken && user._id !== userId) {
          await this.notificationService.sendNewChatMessage(user.deviceToken, group.name);
        }
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
      .sort({ date: -1 });
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
      integrantsOne.push(element._id);
    });
    const groupTwo: any = invitation.groupReceiver;
    groupTwo.integrants.forEach(element => {
      integrantsTwo.push(element._id);
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
        const user = await this.usersService.findOneUser({_id: users, active: true});
          if (user.deviceToken && user._id != userId) {
          await this.notificationService.sendNewChatMessage(user.deviceToken, chat.interGroup.name);
          }
        }
      for await (let users of integrantsTwo) {
        const user = await this.usersService.findOneUser({_id: users, active: true});
          if (user.deviceToken && user._id != userId) {
          await this.notificationService.sendNewChatMessage(user.deviceToken, chat.interGroup.name);
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
      .sort({ date: -1 });
        for await (let message of messages) {
        const mesg: any = await this.messageModel.findOne({ _id: message._id, readBy: { $ne: currentUser._id }});
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
          const user = await this.usersService.findOneUser({_id: chat.user._id, active: true })
       if (user.deviceToken) {
            await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
          }
        } 
    if (chat.adminUser._id != userId) {
              const user = await this.usersService.findOneUser({_id: chat.adminUser._id, active: true })
       if (user.deviceToken) {
            await this.notificationService.sendNewChatMessage(user.deviceToken, chat.name);
          }
        }
    return newMessage;
  }

  async getAllMessagesAdmin(chatId: any, currentUser: any ) {
    let allUnread = [];
    const chat = await this.chatModel.findOne({ _id: chatId, active: true });
    const id = chat._id;
    const messages = await this.messageModel
      .find({
        chat: id
      })
      .sort({ date: -1 });
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
        .sort({ date: -1 });
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
      const invitation = await this.interGroupService.getInvitationId(invitationId);
      const groupOne = invitation.groupSender;
      integrantsOne.push(groupOne.integrants);
      const groupTwo = invitation.groupReceiver;
      integrantsTwo.push(groupTwo.integrants);
      const userInGroup = await this.groupService.getOneUserWithGroup(currentUser, groupOne);
      if (userInGroup === null) userInGroupTwo = await this.groupService.getOneUserWithGroup(currentUser, groupTwo);
      if (userInGroupTwo === null) throw new WsException('The user does not belong to some group');
      const chat: any = await this.chatModel.findOne({ invitation: invitationId, active: true }).populate('interGroup').populate('lastMessage');
      if (chat) {
      const messages = await this.messageModel
        .find({
          chat: chat._id,
          readBy: { $ne: currentUser._id }
        })
        .sort({ date: -1 });
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

    async getUnreadAdmin(chatId: any, currentUser: any ) {
      try {
        const chat: any = await this.chatModel.findOne({ _id: chatId, active: true });
        if (!chat) throw new WsException('Chat does not exist, id incorrect or group inactive.');
        const id = chat._id;
        const messages = await this.messageModel
          .find({
            chat: id,
            readBy: { $ne: currentUser._id }
          })
          .sort({ date: -1 });
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
        allChats.push(group);
        const interGroup = await this.getChatInterGroupsUser(userId);
        allChats.push(interGroup);
        const admin = await this.getChatAdmin(userId);
        allChats.push(admin);
        const userToAdmin = await this.getChatAdminUser(userId);
        allChats.push(userToAdmin);
        return allChats;
      } catch (error) {
        throw new Error(error);
      }
    }
}
