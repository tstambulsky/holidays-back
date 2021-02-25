import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { GroupDTO, UpdateGroupDTO } from './dto/group.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
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
      const group = await this.groupModel.findOne({ _id: groupID, active: true });
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
    return groups;
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

  /*async distanceFilter(distance: any) {
    const groups = await this.groupModel.find({ meetingPlaceOne: {} }).exec();
  } */

  async searchGroupByActivity(activity: string): Promise<Group[]> {
    const groups = await this.groupModel
      .find({ typeOfActivity: new RegExp(activity, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
      .populate('integrants')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    return groups;
    if (!groups) return;
    throw new HttpException('Not Found', 404);
  }

  async searchGroupByName(name: string): Promise<Group[]> {
    const searchGroup = await this.groupModel
      .find({ name: new RegExp(name, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
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
      { $match: { active: false } },
      {
        $lookup: {
          from: 'users',
          localField: 'integrants',
          foreignField: '_id',
          as: 'integrants'
        }
      },
      { $match: { 'integrants._id': { $eq: `${userID}` } } }
    ]);
    return groups;
  }

}
