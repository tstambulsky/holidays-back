import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { UsersService } from '../users/users.service';
import { GroupDTO, UpdateGroupDTO, RequestToGroupDTO, AceptOrRefuseDTO } from './dto/group.dto';
import { Invitation, InvitationDocument } from './schema/invitation.schema';
import { group } from 'console';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(Invitation.name) private readonly invitationModel: Model<InvitationDocument>,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService
  ) {}

  async getGroups(): Promise<Group[]> {
    const groups = await this.groupModel
      .find({ active: true })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!groups) {
      throw new HttpException('Not Found', 404);
    }
    return groups;
  }

  async getGroup(groupID: any): Promise<Group> {
    try {
      const group = await this.groupModel.findOne({ _id: groupID, active: true }).populate('integrants');
      return group;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createGroup(groupDTO: GroupDTO): Promise<string> {
    try {
      const group = new this.groupModel(groupDTO);
      await group.save();
      return 'Group created';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateGroup(groupID: any, data: UpdateGroupDTO): Promise<Group | undefined> {
    try {
      const group = await this.groupModel.findOne({ _id: groupID, active: true });
      const updatedGroup = await group.updateOne({ ...data });
      const groupUpdated = await this.groupModel.findOne({ _id: groupID }).populate('integrants');
      console.log(group);
      return groupUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveGroup(groupID: any): Promise<string> {
    try {
      const group = await this.groupModel.findById(groupID);
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

  async deleteGroup(groupID: any): Promise<string> {
    try {
      await this.groupModel.deleteOne({ _id: groupID });
      return 'Group deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*async suggestedGroups(userCity: any, groupDistance: any) {
    try {
      const groups = await this.groupModel.find({ meetingPlaceOne: groupDistance });
      if ((userCity = groups)) return groups;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  } */

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
      { $match: { 'integrants.sex': { $eq: `${gender}` } } }
    ]);
    console.log(groups);
    if (groups.length < 0) throw new Error ('No have groups')
    return groups;
  } catch (err) {
    throw new Error(err.message)
  };
  }

  async ageFilter(edad: number) {
    const groups: any[] = await this.groupModel.find({ active: true }).populate('integrants');

    groups.forEach((element) => {
      const personasTotales = element.integrants.length;
      let totalEdades = 0;
      element.integrants.forEach((persona) => {
        const edad = getYearOfPerson(persona.birthDate);
        totalEdades += edad;
      });
      const promedio = totalEdades / personasTotales;
      element.promedioDeEdades = promedio;
    });

    const getYearOfPerson = (birthDate) => {
      const year = new Date().getFullYear();
      const date = new Date(birthDate);
      const AniosDePersona = date.getFullYear();
      const result = year - AniosDePersona;
      return result;
    };

    const checkPromedio = async (age) => {
      const maxAge = edad + 3;
      const minAge = edad - 3;
      console.log('max', maxAge);
      console.log('min', minAge);
      const isInPromedio = age <= maxAge && age >= minAge;
      return isInPromedio;
    };

    const gruposFiltrados = groups.filter((group) => checkPromedio(group.promedioDeEdades));
    return gruposFiltrados;
  }

  async searchGroupByActivity(activity: string): Promise<Group[]> {
    try {
    const groups = await this.groupModel
      .find({ typeOfActivity: new RegExp(activity, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!groups) throw new HttpException('Not Found', 404);
    return groups;
   } catch (err) {
     throw new Error (err.message);
   }
}

  async searchGroupByName(name: string): Promise<Group[]> {
    try {
    const searchGroup = await this.groupModel
      .find({ name: new RegExp(name, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!searchGroup) throw new HttpException('Not Found', 404);
    return searchGroup;
   } catch (err) {
     throw new Error(err.message)
   }
}
  async repeatGroup(groupID: any) {
    try {
      const searchGroup = await this.groupModel.findById({ _id: groupID, active: false });
      if (!searchGroup) {
        throw new HttpException('Not Found', 404);
      }
      searchGroup.active = true;
      searchGroup.save();
      return searchGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async previousGroups(userID: any): Promise<Group[]> {
     try {
      const groups = await this.groupModel.find({ active: false, integrants: userID });
    if(groups.length < 0) throw new Error('The user has no previous groups.')
    return groups;
  } catch (err) {
    throw new Error(err.message)
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
      return newInvitation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getInvitationToGroup(groupId: any) {
    try {
      const invitations = await this.invitationModel
        .find({ group: groupId, success: false, active: true, fromAdmin: false })
        .populate('user')
        .populate('group');
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
      if (success) {
        const group = await this.groupModel.findOne({ _id: invitation.group }).populate('integrants');
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
      return 'User added to group';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserGroups(currentUser: any) {
    try {
      const userID = currentUser._id;
      const groups = await this.groupModel.find({ active: true, integrants: userID });
      if (groups.length < 0) throw new Error('The user does not belong to any group');
      return groups;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
