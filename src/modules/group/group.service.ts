import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { UsersService } from '../users/users.service';
import { GroupDTO, UpdateGroupDTO, RequestToGroupDTO, AceptOrRefuseDTO, NewAdminDto, EditPhotosDto } from './dto/group.dto';
import { Invitation, InvitationDocument } from './schema/invitation.schema';
import { distanceBetweenLocations } from './utils/getDistance';
import { getYearOfPerson } from './utils/getYearByDate';
import { checkPromedio } from './utils/checkPromedio';
import { ChatService } from '../chat/chat.service';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(Invitation.name) private readonly invitationModel: Model<InvitationDocument>,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService
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
      const group = await this.groupModel.findOne({active: true, _id: groupId, integrants: currentUser._id})
      if (!group) throw new HttpException('Group does not exist or you dont belong to this group', 404)
      return group;
    } catch (error){
      throw new Error(error)
    }
  }

   async getGroupAdmin(groupId: any, admin: any) {
    try {
      const group = await this.groupModel.findOne({active: true, _id: groupId, admin: admin})
      if (!group) throw new HttpException('Group does not exist or you dont belong to this group', 404)
      return group;
    } catch (error){
      throw new Error(error)
    }
  }

  async getGroupAdminAndUser(groupId: any, admin: any, currentUser: any) {
    try {
      const userId = currentUser._id;
      const group = await this.groupModel.findOne({active: true, _id: groupId, admin: admin, integrants: userId})
      if (!group) throw new HttpException('Group does not exist or you dont belong to this group', 404)
      return group;
    } catch (error){
      throw new Error(error)
    }
  }

  async getGroup(groupId: any): Promise<Group> {
    try {
      const group: any = await this.groupModel
        .findOne({ _id: groupId, active: true })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
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
        personsSex.forEach((sex) => {
          if (sex === 'Male') {
          totalyMale = +1;
        }
        else if (sex === 'male') {
          totalyMale = +1 
        }
        else if (sex === 'Female') {
          totalyFemale = +1
        }
        else if (sex === 'female') {
          totalyFemale = +1
        }
        else if (sex === 'Other') {
          totalyNoGender = +1;
        }
        else if (sex === 'other') {
          totalyNoGender = +1;
        }
        })
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
      return group;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createGroup(groupDTO: GroupDTO, currentUser: any): Promise<Group> {
    try {
      const userId = currentUser._id;
      const ifExist = await this.groupModel.findOne({active: true, name: groupDTO.name});
      if (ifExist) throw new HttpException('Name already exist', 404);
      const group = new this.groupModel(groupDTO);
      group.admin = userId;
      group.groupCreatedBy = userId;
      //@ts-ignore
      group.integrants.push(userId);
      if (!group.endDate) group.endDate = moment(group.startDate).add(12, 'hours').format('YYYY-MM-DD HH:mm A')
      await group.save();
      const chat = await this.chatService.createGroupChat(group._id);
      chat.name = group.name;
      chat.image = group.photo;
      await chat.save();
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
        { $match: { 'integrants.sex': new RegExp('^'+ `${gender}` + '$', 'i')}}
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
      const { user, group } = data;
      const groupExist = await this.groupModel.findOne({ _id: group }).populate('integrants');
      const userExist = await this.userService.getUserById(user);
      if (!groupExist || !userExist) throw new Error('This group or user does not exist');
      const isIngroup = await this.groupModel.findOne({ _id: group, integrants: user });
      if (isIngroup) throw new Error('This User is already in the group');
      const alreadyInvite = await this.invitationModel.find({ user, group, active: true });
      if (alreadyInvite.length > 0) throw new Error('User already invite');
      const newInvitation = new this.invitationModel(data);
      await newInvitation.save();
      const admin = await this.chatService.createAdminChat(group);
      admin.name = `${userExist.name} ${userExist.lastName} + Admin chat of ${groupExist.name}`,
      admin.user = user;
      await admin.save();
      return newInvitation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /*async requestToJoinGroup(currentUser: any, data: RequestToGroupDTO) {
    try {
      const userId = currentUser._id;
      const { group } = data;
      const groupExist = await this.groupModel.findOne({ _id: group }).populate('integrants');
      if (!groupExist) throw new Error('This group does not exist');
      const isIngroup = await this.groupModel.findOne({ _id: group, integrants: userId });
      if (isIngroup) throw new Error('This user is already in the group');
      const alreadyInvite = await this.invitationModel.find({ user: userId, group, active: true });
      if (alreadyInvite.length > 0) throw new Error('User already invite');
      const newInvitation = new this.invitationModel(data);
      newInvitation.user = userId;
      await newInvitation.save();
      const admin = await this.chatService.createAdminChat(group);
      admin.name = `Admin chat of ${groupExist.name}`,
      admin.user = userId;
      await admin.save();
      return 'Request sent to the group admin.'
    } catch (error) {
      throw new Error(error.message);
    }
  }*/

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
      const invitation = await this.invitationModel.findOne({ _id: invitationId, fromAdmin: false });
      if (!invitation) throw new Error('This invitation does not exist');
      if (invitation.success) throw new Error('This invitation is already success');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
      const user = await this.userService.getUserById(invitation.user);
      if (group.admin != userId) throw new Error('This user is not the admin of this group');
      invitation.success = true;
      invitation.active = false;
      await invitation.save();
      //@ts-ignore
      group.integrants.push(user);
      await group.save();
      const chats = await this.chatService.getOneChatAdmin(currentUser, invitation.group);
      chats.active = false;
      await chats.save();
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refuseInvitationToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId } = data;
      const userId = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId, fromAdmin: false });
      if (!invitation) throw new Error('This invitation does not exist');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
      if (group.admin != userId) throw new Error('This user is not the admin of this group');
      invitation.active = false;
      await invitation.save();
      const chats = await this.chatService.getOneChatAdmin(currentUser, invitation.group);
      chats.active = false;
      await chats.save();
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
      const invitations = await this.invitationModel.find({ user: userId, fromAdmin: true, active: true });
      if (invitations.length < 0) throw new Error('This user does not has invitations');
      return invitations;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptOrRefuseMyRequests(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId, success } = data;
      const userId = currentUser._id;
      const user = await this.userService.getUserById(userId);
      if (!user) throw new Error('This user does not exist');
      const invitation = await this.invitationModel.findOne({ _id: invitationId, fromAdmin: true, active: true });
      if (!invitation) throw new Error('Bad invitation');
      const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
      if (success) {
        //@ts-ignore
        group.integrants.push(user);
        await group.save();
        invitation.success = true;
        invitation.active = false;
      } else {
        invitation.success = false;
        invitation.active = false;
      }
      await invitation.save();
      const admin = await this.chatService.getOneChatAdminUser(currentUser, group._id);
      admin.active = false;
      await admin.save();
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

   async getOneUserGroup(currentUser: any) {
    try {
      const groups = await this.groupModel
        .findOne({ active: true, integrants: currentUser })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .populate('typeOfActivity');
      if (!groups) throw new Error('The user does not belong to any group');
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
        .findOne({ active: true, integrants: userId, _id: groupId })
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

  async nearbyGroups(currentUser) {
    try {
        const userId = currentUser._id;
        const user = await this.userService.getUserById(userId);
        if (!user || !user.latitude) throw new Error('We dont have information about this user');
        const allGroups = await this.groupModel.find({ active: true }).populate('meetingPlaceOne');
        let groupsInRange = [];
        const groupsFiltered = allGroups.filter((element) => element.meetingPlaceOne !== null);
        for (let data of groupsFiltered) {
        const distance = distanceBetweenLocations(user, data.meetingPlaceOne);
        if (distance < 5) {
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
      if (!groups) throw new HttpException ('User has not created groups', 404)
      return groups;
    } catch (error) {
      throw new Error (error.message);
    }
  }

  async groupsOfMyContacts(users: any[]) {
    try {
     const groupsContacts = await this.userService.searchContact(users);
      let allGroups = [];
      for await (let group of groupsContacts) {
        const data = await this.groupModel.find({integrants: group._id})
        if (data) {
          allGroups.push(data);
        }
      }
      return allGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async setGroupPhoto(currentUser: any, groupId: any, file: any){
     try {
       const userId = currentUser._id;
       const group = await this.groupModel.findOne({_id: groupId, admin: userId});
       if(!group) throw new HttpException('The group does not exist or you are not the admin of the group.', 404);
       await group.updateOne({ photo: file.filename });
       const chat = await this.chatService.getChatbyGroup(groupId);
       chat.image = group.photo;
       chat.save();
       return group;
     } catch (error) {
       throw new Error(error.message)
     }
    }

    /*async getGroupsBestCalificated() {
      try {
        let allGroups = [];
        let allIntegrants = [];
        const groups = await this.groupModel.find({active: true})
        for await (let group of groups) {
          allIntegrants.push(group.integrants);
          allIntegrants.forEach((element) => {
            element.cal
          })
         
        }
      } 
    }

  /*async threeFilters(gender: any, distance: any, age: any, currentUser: any) {
    try {
      let allFilters = [];
      let ageFilter = [];
      let distanceFilter = [];
      let filterGender = [];
      if (age) {
      ageFilter = await this.ageFilter(age);
      }
       if (distance) {
      distanceFilter = await this.searchByDistance(currentUser,distance);
      }
       if (gender) {
      filterGender = await this.genderFilter(gender);
      }
    
      return allFilters;
     
    } catch (error) {
      throw new Error(error.message);
    }
  }*/
}
