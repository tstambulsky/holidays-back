import { Injectable, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { InterGroup, InterGroupDocument } from './schema/interGroup.schema'
import { InterGroupDTO, UpdateInterGroupDTO } from './dto/interGroup.dto'

@Injectable()
export class InterGroupService {
   constructor(@InjectModel(InterGroup.name) private readonly interGroupModel: Model<InterGroupDocument>) {}

   async getInterGroups(): Promise<InterGroup[]> {
      const interGroups = await this.interGroupModel
         .find({ active: true })
         .populate('groupOne')
         .populate('groupTwo')
         .populate('meetingPlaceOne')
         .populate('meetingPlaceTwo')
         .exec()
      if (!interGroups) {
         throw new HttpException('Not Found', 404)
      }
      return interGroups
   }

   async getInterGroup(interGroupID: any): Promise<InterGroup> {
      try {
         const interGroup = await this.interGroupModel.findOne({ _id: interGroupID }, { active: true })
         console.log(interGroup)
         return interGroup
      } catch (err) {
         console.log(err)
         throw new Error(err.message)
      }
   }

   async createInterGroup(interGroupDTO: InterGroupDTO): Promise<string> {
      try {
         const interGroup = await new this.interGroupModel(interGroupDTO)
         await interGroup.save()
         return 'Inter Group created'
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async updateInterGroup(interGroupID: any, data: UpdateInterGroupDTO): Promise<InterGroup | undefined> {
      try {
         const interGroup = await this.interGroupModel.findOne({ _id: interGroupID })
         const updatedInterGroup = await this.interGroupModel.updateOne({ ...data })
         const interGroupUpdated = await this.interGroupModel.findOne({ _id: interGroupID })
         return interGroupUpdated
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async deleteInterGroup(interGroupID: any): Promise<string> {
      try {
         await this.interGroupModel.deleteOne({ _id: interGroupID })
         return 'Inter Group deleted'
      } catch (err) {
         throw new Error(err.message)
      }
   }
}
