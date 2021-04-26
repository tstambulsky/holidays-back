import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { UsersService } from '../users/users.service';
import { GroupDTO, UpdateGroupDTO, RequestToGroupDTO, AceptOrRefuseDTO, NewAdminDto } from './dto/group.dto';
import { Invitation, InvitationDocument } from './schema/invitation.schema';
import { distanceBetweenLocations } from './utils/getDistance';
import { getYearOfPerson } from './utils/getYearByDate';
import { checkPromedio } from './utils/checkPromedio';
import { ChatService } from '../chat/chat.service';
import { getAvailability } from './utils/getAvailability';
import { removeImage } from '../users/utils/deleteImage';
import { NotificationService } from '../notification/notification.service';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(Invitation.name) private readonly invitationModel: Model<InvitationDocument>,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
    private readonly notificationService: NotificationService
  ) {}

  async getGroups(): Promise<Group[]> {
    const groups = await this.groupModel
      .find({ active: true })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .populate('TypeOfActivity')
      .exec();
    if (!groups) {
      throw new HttpException('Not Found', 404);
    }
    return groups;
  }

  async getGroupChat(groupId: any, currentUser: any) {
    try {
      const group = await this.groupModel.findOne({ active: true, _id: groupId, integrants: currentUser._id });
      if (!group) throw new HttpException('Group does not exist or you dont belong to this group', 404);
      return group;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGroupAdmin(groupId: any, admin: any) {
    try {
      const group = await this.groupModel.findOne({ active: true, _id: groupId, admin: admin });
      if (!group) throw new HttpException('Group does not exist or you dont belong to this group', 404);
      return group;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGroupAdminAndUser(groupId: any, admin: any, currentUser: any) {
    try {
      const userId = currentUser._id;
      const group = await this.groupModel.findOne({ active: true, _id: groupId, admin: admin, integrants: userId });
      if (!group) throw new HttpException('Group does not exist or you dont belong to this group', 404);
      return group;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGroup(groupId: any): Promise<Group> {
    try {
      const group: any = await this.groupModel
        .findOne({ _id: groupId })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
        if(!group) throw new HttpException('Group does not exist', 404);
      const totalyPeople = group.integrants.length;
      let totalyAge = 0;
      let personsSex = [];
      let totalyMale = 0;
      let totalyFemale = 0;
      let totalyNoGender = 0;

      group.integrants.forEach((people) => {
        personsSex.push(people.sex);
        const ageFilter = getYearOfPerson(people.birthDate);
        totalyAge += ageFilter;
      });
      for await (let sex of personsSex) {
          if (sex === 'male') {
          totalyMale = totalyMale + 1;
        }
          if (sex === 'female') {
          totalyFemale = totalyFemale + 1;
        } if (sex === 'other') {
          totalyNoGender = totalyNoGender + 1;
        }
      };
      let totalCalifications = 0;
      group.integrants.forEach((people) => {
        const califications = people.points;
        totalCalifications += califications;
      });
      const averageAge = totalyAge / totalyPeople;
      const averageCalifications = totalCalifications / totalyPeople;
      group.averageAge = averageAge;
      group.calificationsAverage = averageCalifications;
      const percentlyMale = (totalyMale * 100) / totalyPeople;
      const percentlyFemale = (totalyFemale * 100) / totalyPeople;
      const percentlyNoGender = (totalyNoGender * 100) / totalyPeople;
      group.percentageOfMale = percentlyMale;
      group.percentageOfFemale = percentlyFemale;
      group.percentageOfNoGender = percentlyNoGender;
      await group.save();
      return group;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createGroup(groupDTO: GroupDTO, currentUser: any): Promise<Group> {
    try {
      const userId = currentUser._id;
      const ifExist = await this.groupModel.findOne({ active: true, name: groupDTO.name });
      if (ifExist) throw new HttpException('Name already exist', 404);
      const group = new this.groupModel(groupDTO);
      group.admin = userId;
      group.groupCreatedBy = userId;
      //@ts-ignore
      group.integrants.push(userId);
      if (!group.endDate) group.endDate = moment(group.startDate).add(12, 'hours').format('YYYY-MM-DD HH:mm');
      const valid = await this.validateGroups(currentUser, group);
      if(!valid) throw new HttpException('You have another group at the same time', 404);
      await group.save();
      await this.chatService.createGroupChat(group._id);
      return group;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateGroup(groupId: any, data: UpdateGroupDTO, currentUser: any): Promise<Group | undefined> {
    try {
      const userId = currentUser._id;
      const group = await this.groupModel.findOne({ _id: groupId, active: true });
      if (group.admin != userId) throw new Error('You do not have privileges to perform this action.');
      await group.updateOne({ ...data });
      const groupUpdated = await this.groupModel.findOne({ _id: groupId }).populate('integrants');
      return groupUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveGroup(groupId: any): Promise<string> {
    try {
      const group = await this.groupModel.findById(groupId);
      if (!group) {
        throw new HttpException('Not Found', 404);
      }
      group.active = false;
      await group.save();
      const chat = await this.chatService.getChatbyGroup(groupId);
      chat.active = false;
      chat.save();
      return 'Group change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteGroup(groupId: any): Promise<string> {
    try {
      await this.groupModel.deleteOne({ _id: groupId });
      return 'Group deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async genderFilter(gender: string) {
    try {
      const groups = await this.groupModel.aggregate([
        { $match: { active: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'integrants',
            foreignField: '_id',
            as: 'integrants'
          }
        },
        { $match: { 'integrants.sex': new RegExp('^' + `${gender}` + '$', 'i') } }
      ]);
      if (groups.length < 0) throw new Error('No have groups');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async ageFilter(averageAge: number) {
    try {
      const groups: any[] = await this.groupModel.find({ active: true }).populate('integrants');

      groups.forEach((element) => {
        const totalPeople = element.integrants.length;
        let allAges = 0;
        element.integrants.forEach((person) => {
          const year = getYearOfPerson(person.birthDate);
          allAges += year;
        });
        const averages = allAges / totalPeople;
        element.average = averages;
      });

      const finalGroups = groups.filter((group) => checkPromedio(group.average, averageAge));
      return finalGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchGroupByActivity(activity: string): Promise<Group[]> {
    try {
      const groups = await this.groupModel.aggregate([
        { $match: { active: true } },
        {
          $lookup: {
            from: 'typeofactivities',
            localField: 'typeOfActivity',
            foreignField: '_id',
            as: 'typeOfActivity'
          }
        },
        { $match: { 'typeOfActivity.name': { $eq: `${activity}` } } }
      ]);
      if (groups.length < 0) throw new Error('No have groups');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchGroupByName(name: string): Promise<Group[]> {
    try {
      const searchGroup = await this.groupModel
        .find({ name: new RegExp(name, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity')
        .exec();
      if (!searchGroup) throw new HttpException('Not Found', 404);
      return searchGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async repeatGroup(groupId: any, currentUser: any) {
    try {
      const userId = currentUser._id;
      const searchGroup = await this.groupModel.findById({ _id: groupId, active: false, admin: userId });
      if (!searchGroup) {
        throw new HttpException('Group not found or you are not the admin', 404);
      }
      searchGroup.active = true;
      searchGroup.save();
      const chat = await this.chatService.getChatbyGroup(groupId);
      chat.active = true;
      chat.save();
      return searchGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async previousGroups(currentUser: any): Promise<Group[]> {
    try {
      const userId = currentUser._id;
      const groups = await this.groupModel
        .find({ active: false, integrants: userId })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      if (groups.length < 0) throw new Error('The user has no previous groups.');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendInvitationToGroup(data: RequestToGroupDTO) {
    try {
      let integrants = [];
      const { user, group, fromAdmin } = data;
      const groupExist = await this.groupModel.findOne({ _id: group }).populate('integrants').populate('admin');
      const userExist = await this.userService.getUserById(user);
      if (!groupExist || !userExist) throw new Error('This group or user does not exist');
      integrants.push(groupExist.integrants);
      const isIngroup = await this.groupModel.findOne({ _id: group, integrants: user });
      if (isIngroup) throw new Error('This User is already in the group');
      const alreadyInvite = await this.invitationModel.find({ user, group, active: true });
      if (alreadyInvite.length > 0) throw new Error('User already invite');
      const newInvitation = new this.invitationModel(data);
      await newInvitation.save();
      const chat = await this.chatService.getOneChatAdminUserWithout(user, group);
      if (!chat) {
         await this.chatService.createAdminChat(group, userExist);
      } if (chat) {
        chat.active = true;
        chat.save();
      }
      if (fromAdmin == true) {
        if (userExist.deviceToken) {
        await this.notificationService.sendInvitationGroupToUser(userExist.deviceToken, groupExist.name);
        }
      } if (fromAdmin == false) {
        for await (let users of integrants) {
          const user = await this.userService.findOneUser({_id: users, active: true});
          console.log('devicee', user.deviceToken);
          if(user.deviceToken) {
             await this.notificationService.sendInvitationToAdmin(user.deviceToken, userExist.name, groupExist.name);
        }
          }
        }
      return newInvitation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPendingInvitations(groupId: any) {
    try {
      const invitations = await this.invitationModel.find({ group: groupId, active: true, fromAdmin: true }).populate('user')
        .populate('group');
      if (invitations.length < 0) throw new HttpException('The group has no invitations pending acceptance.', 404);
      return invitations
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPendingInvitationsUser(currentUser: any) {
    try {
      const userId = currentUser._id;
      const invitations = await this.invitationModel.find({ user: userId, active: true, fromAdmin: false }).populate('user').populate('group');
      if (invitations.length < 0) throw new HttpException('The user has no invitations pending acceptance.', 404);
      return invitations
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getInvitationToGroup(groupId: any) {
    try {
      const invitations = await this.invitationModel
        .find({ group: groupId, success: false, active: true, fromAdmin: false })
        .populate('user')
        .populate('group')
        .populate('typeOfActivity');
      if (invitations.length < 0) throw new Error('This group does not has requests');
      return invitations;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptInvitationToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId } = data;
      const userId = currentUser._id;
      const invitation: any = await this.invitationModel.findOne({ _id: invitationId, fromAdmin: false }).populate('user');
      if (!invitation) throw new Error('This invitation does not exist');
      if (invitation.success) throw new Error('This invitation is already success');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
      const user = await this.userService.getUserById(invitation.user._id);
      //Validate that user does not have other
      const valid = await this.validateGroups(user, group);
      if (!valid) {
        invitation.success = false;
        invitation.active = false;
        await invitation.save();
        return 'The user have another group at the same time';
      }
      if (group.admin != userId) throw new Error('This user is not the admin of this group');
      invitation.success = true;
      invitation.active = false;
      await invitation.save();
      //@ts-ignore
      group.integrants.push(user);
      await group.save();
      const chats = await this.chatService.getOneChatAdminWithUser(userId, invitation.user);
      chats.active = false;
      await chats.save();
      if (user.deviceToken) {
       await this.notificationService.sendAcceptGroup(user.deviceToken, group.name);
      }
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refuseInvitationToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId } = data;
      const userId = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId, fromAdmin: false }).populate('user');
      if (!invitation) throw new Error('This invitation does not exist');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
      if (group.admin != userId) throw new Error('This user is not the admin of this group');
      invitation.active = false;
      await invitation.save();
      const chat = await this.chatService.getOneChatAdminWithUser(userId, invitation.user);
      chat.active = false;
      await chat.save();
      const user = await this.userService.findOneUser({_id: invitation.user, active: true});
      if (user.deviceToken) {
      await this.notificationService.sendNoAcceptGroup(user.deviceToken, group.name);
      }
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMyRequestsToJoinGroup(currentUser: any) {
    try {
      const userId = currentUser._id;
      const user = await this.userService.getUserById(userId);
      if (!user) throw new Error('This user does not exist');
      const invitations = await this.invitationModel.find({ user: userId, fromAdmin: true, active: true }).populate('group');
      if (invitations.length < 0) throw new Error('This user does not has invitations');
      return invitations;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptOrRefuseMyRequests(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      let integrants = [];
      const { invitationId, success } = data;
      const userId = currentUser._id;
      const user = await this.userService.getUserById(userId);
      if (!user) throw new Error('This user does not exist');
      const invitation = await this.invitationModel.findOne({ _id: invitationId, fromAdmin: true, active: true }).populate('user');
      if (!invitation) throw new Error('Bad invitation');
      const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
      integrants.push(group.integrants);
      const chat = await this.chatService.getOneChatAdminUser(userId, group._id);
      if (success) {
        //Validate that user does not have other
        const valid = await this.validateGroups(user, group);
        if (!valid) {
          invitation.success = false;
          invitation.active = false;
          await invitation.save();
          return 'The user have another group at the same time';
        }
        //@ts-ignore
        group.integrants.push(user);
        await group.save();
        invitation.success = true;
        invitation.active = false;
        chat.active = false;
        for await (let users of integrants){
          console.log('integrants', integrants)
          const user = await this.userService.findOneUser({_id: users, active: true});
          if (user.deviceToken) {
        await this.notificationService.sendUserAccept(user.deviceToken, user.name, group.name);
          }
        }
      } else {
        invitation.success = false;
        invitation.active = false;
        chat.active = false;
         for await (let users of integrants){
          console.log('integrants', integrants)
          const user = await this.userService.findOneUser({_id: users, active: true});
          if (user.deviceToken) {
        await this.notificationService.sendUserNoAccept(user.deviceToken, user.name, group.name);
          }
      }
    }
      await invitation.save();
      await chat.save();
      return 'The changes to your invitation have been saved.';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserGroups(currentUser: any) {
    try {
      const userID = currentUser._id;
      const groups = await this.groupModel
        .find({ active: true, integrants: userID })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      if (groups.length < 0) throw new Error('The user does not belong to any group');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserGroupsAll(currentUser: any) {
     try {
      const userID = currentUser._id;
      const groups = await this.groupModel
        .find({integrants: userID })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      if (groups.length < 0) throw new Error('The user does not belong to any group');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

   async getPreviousUserGroups(currentUser: any) {
    try {
      const userID = currentUser._id;
      const groups = await this.groupModel
        .find({ active: false, integrants: userID })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      if (groups.length < 0) throw new Error('The user does not belong to any group');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getOneUserGroup(userId: any, groupOne: any, secondGroup: any){
    try {
      const groups = await this.groupModel
        .findOne({integrants: userId, $or:[ {_id: groupOne}, {_id: secondGroup}]})
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getOneUserWithGroup(currentUser: any, group: any) {
    try {
      const groupId = group._id;
      const userId = currentUser._id;
      const groups = await this.groupModel
        .findOne({ integrants: userId, _id: groupId })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

   async getOneUserWithGroupInactive(currentUser: any, group: any) {
    try {
      const groupId = group._id;
      const userId = currentUser._id;
      const groups = await this.groupModel
        .findOne({integrants: userId, _id: groupId })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchByDistance(currentUser, maxDistance) {
    try {
      const userId = currentUser._id;
      const user = await this.userService.getUserById(userId);
      if (!user || !user.latitude) throw new Error('We dont have information about this user');
      const allGroups = await this.groupModel.find({ active: true }).populate('meetingPlaceOne');
      let groupsInRange = [];
      const groupsFiltered = allGroups.filter((element) => element.meetingPlaceOne !== null);
      for (let data of groupsFiltered) {
        const distance = distanceBetweenLocations(user, data.meetingPlaceOne);
        if (distance < maxDistance) {
          groupsInRange.push(data);
        }
      }
      return groupsInRange;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async nearbyGroups(currentUser: any) {
    try {
      const userId = currentUser._id;
      const user = await this.userService.getUserById(userId);
      if (!user || !user.latitude) throw new Error('We dont have information about this user');
      const allGroups = await this.groupModel.find({ active: true }).populate('meetingPlaceOne');
      let groupsInRange = [];
      const groupsFiltered = allGroups.filter((element) => element.meetingPlaceOne !== null);
      for (let data of groupsFiltered) {
        const distance = distanceBetweenLocations(user, data.meetingPlaceOne);
        if (distance < 100) {
          groupsInRange.push(data);
        }
      }
      return groupsInRange;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async setNewAdmin(currentUser: any, data: NewAdminDto) {
    try {
      const { adminId, groupId } = data;
      const userId = currentUser._id;
      const group = await this.groupModel.findOne({ _id: groupId, active: true });
      if (!group) throw new Error('This group does not exist');
      if (group.admin != userId) throw new Error('You dont have permission to set a new Admin');
      group.admin = adminId;
      await group.save();
      return 'New Admin seted';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async groupsCreatedByUser(currentUser: any) {
    try {
      const userId = currentUser._id;
      const groups = await this.groupModel.find({ groupCreatedBy: userId });
      if (!groups) throw new HttpException('User has not created groups', 404);
      return groups;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async groupsOfMyContacts(users: any[]) {
    try {
      //const perPage = query.perpage || 50;
      //const page = query.page || 1;
      const groupsContacts = await this.userService.searchContact(users);
      let allGroups = [];
      for await (let group of groupsContacts) {
        const data = await this.groupModel.find({ active: true, integrants: group._id });
        //skip: perPage * page - perPage,
        //take: perPage });
        if (data) {
          allGroups.push(data);
        }
      }
      return allGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async setGroupPhoto(currentUser: any, groupId: any, file: any, url) {
    try {
      const userId = currentUser._id;
      const group = await this.groupModel.findOne({ _id: groupId, admin: userId });
      if (!group) throw new HttpException('The group does not exist or you are not the admin of the group.', 404);
      await group.updateOne({ photo: url });
      const chat = await this.chatService.getChatbyGroup(groupId);
      await chat.updateOne({ image: url });
      await removeImage(file.path);
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateGroups(user: any, group: any) {
    try {
      const userGroups = await this.getUserGroups(user);
      const valid = getAvailability(group, userGroups);
      console.log('Valid from service: ', valid);
      return valid;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getGroupsBestCalificated() {
      try {
        const groups = await this.groupModel.find({active: true});
          for await (let group of groups) {
            await this.getGroup(group._id);
       };
       const allGroups = await this.groupModel.find().sort({calificationsAverage: 1}).exec();
       return allGroups;
    } catch (error) {
    throw new Error(error.message)
  }
}

  async getPreviusGroupsOfUser(userId: any) {
    try {
      const groups = await this.groupModel.find({active: false, integrants: userId});
      if (groups.length < 0) throw new Error('This user does not have plains');
      return groups;
    } catch (error) {
      throw new Error(error.message)
    }
  }

}
