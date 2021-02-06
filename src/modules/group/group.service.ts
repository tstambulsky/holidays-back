import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { GroupDTO, UpdateGroupDTO, ActivityDTO, ActivityInterface } from './dto/group.dto';
import * as moment from 'moment';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>) {}

  async getGroups(): Promise<Group[]> {
    const groups = await this.groupModel.find().populate('integrants').populate('meetingPlaceOne').populate('meetingPlaceTwo').exec();
    if (!groups) {
      throw new HttpException('Not Found', 404);
    }
    return groups;
  }

  async getGroup(groupID: any): Promise<Group> {
    try {
      const group = await this.groupModel
        .findOne({ _id: groupID })
        .populate('integrants')
        .populate('meetingPlaceOne')
        .populate('meetingPlaceTwo')
        .exec();
      console.log(group);
      return group;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  /* async searchByGender(): Promise<Group[]> {
    const searchGroup = await this.groupModel.find().populate('integrants').populate('meetingPlaceOne').populate('meetingPlaceTwo').exec()
  } */

  async searchGroupByActivity(typeOfActivity): Promise<Group[]> {
    const searchGroup = await this.groupModel
      .find({ typeOfActivity: { $regex: new RegExp(typeOfActivity, 'i') } })
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
      .find({ name: { $regex: new RegExp(name, 'i') } })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!searchGroup) {
      throw new HttpException('Not Found', 404);
    }
    return searchGroup;
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
      const group = await this.groupModel.findOneAndUpdate({ _id: groupID }, { ...data });
      console.log(group);
      return group;
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
