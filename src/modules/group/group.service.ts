import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { GroupDTO, UpdateGroupDTO } from './dto/group.dto';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>) {}

  async getGroups(): Promise<Group[]> {
    const groups = await this.groupModel.find();
    if (!groups) {
      throw new HttpException('Not Found', 404);
    }
    return groups;
  }

  async getGroup(groupID: any): Promise<Group> {
    try {
      const group = await this.groupModel.findOne({ _id: groupID });
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
      const group = await this.groupModel.findOne({ _id: groupID });
      const updatedGroup = await group.updateOne({ ...data });
      const groupUpdated = await this.groupModel.findOne({ _id: groupID });
      return groupUpdated;
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
}
