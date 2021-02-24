import { Injectable, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Group, GroupDocument } from './schema/group.schema'
import { User, UserDocument } from '../users/schema/users.schema'
import { InterGroup, InterGroupDocument } from '../inter-group/schema/interGroup.schema';
import { InterGroupService } from '../inter-group/interGroup.service';
import { GroupDTO, UpdateGroupDTO, CreateInterGroupDTO } from './dto/group.dto';
import * as moment from 'moment'

@Injectable()
export class GroupService {
   constructor(
      @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
      @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
      @InjectModel(InterGroup.name) private readonly interGroupModel: Model<InterGroupDocument>,
      private readonly interGroupService: InterGroupService
   ) {}

   async getGroups(): Promise<Group[]> {
      const groups = await this.groupModel
         .find({ active: true })
         .populate('integrants')
         .populate('meetingPlaceOne')
         .populate('meetingPlaceTwo')
         .exec()
      if (!groups) {
         throw new HttpException('Not Found', 404)
      }
      return groups
   }

   async getGroup(groupID: any): Promise<Group> {
      try {
         const group = await this.groupModel.findOne({ _id: groupID, active: true })
         console.log(group)
         return group
      } catch (err) {
         console.log(err)
         throw new Error(err.message)
      }
   }

   async createGroup(groupDTO: GroupDTO): Promise<string> {
      try {
         const group = await new this.groupModel(groupDTO)
         await group.save()
         return 'Group created'
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async updateGroup(groupID: any, data: UpdateGroupDTO): Promise<Group | undefined> {
      try {
         const group = await this.groupModel.findOne({ _id: groupID, active: true })
         const updatedGroup = await group.updateOne({ ...data })
         const groupUpdated = await this.groupModel.findOne({ _id: groupID }).populate('integrants')
         console.log(group)
         return groupUpdated
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async toInactiveGroup(groupID: any): Promise<string> {
      try {
         const group = await this.groupModel.findById(groupID)
         if (!group) {
            throw new HttpException('Not Found', 404)
         }
         group.active = false
         await group.save()
         return 'Group change to inactive'
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async deleteGroup(groupID: any): Promise<string> {
      try {
         await this.groupModel.deleteOne({ _id: groupID })
         return 'Group deleted'
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async suggestedGroups(userCity: any, groupDistance: any) {
      try {
         const groups = await this.groupModel.find({ meetingPlaceOne: groupDistance })
         if ((userCity = groups)) return groups
      } catch (err) {
         console.log(err)
         throw new Error(err.message)
      }
   }

   async genderFilter(gender: string) {
      const groups = await this.groupModel.aggregate([
         { $match: { active: true } },
         {
            $lookup: {
               from: 'users',
               localField: 'integrants',
               foreignField: '_id',
               as: 'integrants',
            },
         },
         { $match: { 'integrants.sex': { $eq: `${gender}` } } },
      ])
      console.log(groups)
      return groups
   }

   async ageFilter(age: number) {
      const groups: any[] = await this.groupModel.find({ active: true }).populate('integrants')

      const getYearOfPerson = (birthDate) => {
         const year = new Date().getFullYear()
         const date = new Date(birthDate)
         const yearOfPerson = date.getFullYear()
         const result = year - yearOfPerson
         return result
      }

      groups.forEach((element) => {
         const personasTotales = element.integrants.length
         let totalEdades = 0
         element.integrants.forEach((person) => {
            const edad = getYearOfPerson(person.birthDate)
            totalEdades += edad
         })
         const promedio = totalEdades / personasTotales
         element.promedioDeEdades = promedio
      })

      const checkPromedio = (edad) => {
         const maxAge = Number(age) + 3
         const minAge = Number(age) - 3
         const isInPromedio = edad <= maxAge && edad >= minAge
         return isInPromedio
      }

      const gruposFiltrados = groups.filter((group) => checkPromedio(group.promedioDeEdades));
      return gruposFiltrados
   }

   async distanceFilter(distance: any) {
      const groups = await this.groupModel.find({ meetingPlaceOne: {} }).exec()
   }

   async searchGroupByActivity(activity: string): Promise<Group[]> {
      const groups = await this.groupModel
         .find({ typeOfActivity: new RegExp(activity, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
         .populate('integrants')
         .populate('meetingPlaceOne')
         .populate('meetingPlaceTwo')
         .exec()
      return groups
      if (!groups) return
      throw new HttpException('Not Found', 404)
   }

   async searchGroupByName(name: string): Promise<Group[]> {
      const searchGroup = await this.groupModel
         .find({ name: new RegExp(name, 'i') }, { active: true, name: 1, description: 1, typeOfActivity: 1 })
         .populate('integrants')
         .populate('meetingPlaceOne')
         .populate('meetingPlaceTwo')
         .exec()
      if (!searchGroup) {
         throw new HttpException('Not Found', 404)
      }
      return searchGroup
   }

   async repeatGroup(groupID: any) {
      try {
         const searchGroup = await this.groupModel.findById({ _id: groupID, active: false })
         if (!searchGroup) {
            throw new HttpException('Not Found', 404)
         }
         searchGroup.active = true
         searchGroup.save()
         return searchGroup
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
               as: 'integrants',
            },
         },
         { $match: { 'integrants._id': { $eq: `${userID}` } } },
      ])
      return groups
   }

   async sendInvitation(createInterGroup: CreateInterGroupDTO) {
     const group = await this.groupModel.findOne({ active: true })
     if (group.admin === createInterGroup.userID) {
     const interGroup = await this.interGroupModel.findOne({ active: true });
      if(interGroup.groupOne == createInterGroup.groupOne || createInterGroup.groupTwo ) {
          return 'InterGroup already exists'
        }
        else {
          const create = await this.interGroupService.createInterGroup(createInterGroup)
        }
     } 
     else {
      return 'You dont have privileges to do this action'
     }

   }
}
