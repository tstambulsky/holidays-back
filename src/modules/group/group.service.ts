import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { User, UserDocument } from '../users/schema/users.schema';
import { GroupDTO, UpdateGroupDTO, ActivityDTO, ActivityInterface } from './dto/group.dto';
import * as moment from 'moment';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
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
      const group = await this.groupModel
        .findOne({ _id: groupID, active: true })
      console.log(group);
      return group;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createGroup(groupDTO: GroupDTO): Promise<string> {
    try {
      const group = await new this.groupModel(groupDTO);
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

  async suggestedGroups(userCity: any, groupDistance: any) {
    try {
      const groups = await this.groupModel.find({ meetingPlaceOne: groupDistance });
      if ((userCity = groups)) return groups;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async genderFilter(gender: string) {
   console.log(gender);
    const groups = await this.groupModel.aggregate([
      {$match: { active: true }},
      {$lookup: {
          from: 'users',
          localField: 'integrants',
          foreignField: '_id',
          as: 'integrants'
      }
    },
    {$match: { 'integrants.sex': { $eq: `${gender}` } }}
    ]);
    console.log(groups);
   return groups;
  }

  async ageFilter(age: any) {
    const groups = await this.groupModel.aggregate([
      {$match: { active: true }},
      {$lookup: {
          from: 'users',
          localField: 'integrants',
          foreignField: '_id',
          as: 'birthdays'
      }
    }
    ]);;
  }

  async distanceFilter(distance: any) {
    const groups = await this.groupModel.find({ meetingPlaceOne: {} }).exec();
  }

  async searchGroupByActivity(typeOfActivity: string): Promise<Group[]> {
    const searchGroup = await this.groupModel
      .find({ typeOfActivity: { $regex: new RegExp(typeOfActivity, 'i') } }, { active: true })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!searchGroup) {
      throw new HttpException('Not Found', 404);
    }
    return searchGroup;
  }

  async searchGroupByName(name): Promise<Group[]> {
    const searchGroup = await this.groupModel
      .find({ name: { $regex: new RegExp(name, 'i') } }, { active: true })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!searchGroup) {
      throw new HttpException('Not Found', 404);
    }
    return searchGroup;
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
    } catch (err) {}
  }

  async previousGroups(userID: any): Promise<Group[]> {
    const groups = await this.groupModel.aggregate([
         {$match: { active: false }},
      {$lookup: {
          from: 'users',
          localField: 'integrants',
          foreignField: '_id',
          as: 'integrants'
      }
    },
    {$match: { 'integrants._id': { $eq: `${userID}` } }}
      ]);
    return groups;
  }

  years(birthDate) {
    birthDate.moment().format('YYYY Do MMM DD');
    let born = moment(birthDate); //format YYYY-MM-DD
    let today = moment();
    let years = 0;
    if (born < today) {
      years = today.diff(born, 'years'); //Calculate diff in years
    } else {
      console.error('The date of birth cannot be higher than the current system date.');
    }
    return years;
  }
}
