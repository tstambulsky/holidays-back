import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterGroup, InterGroupDocument } from './schema/interGroup.schema';
import { InterGroupDTO, UpdateInterGroupDTO, RequestGroupToGroupDTO, AceptOrRefuseDTO } from './dto/interGroup.dto';
import { InvitationInterGroup, InvitationInterGroupDocument } from './schema/invitation.schema';
import { GroupService } from '../group/group.service';

@Injectable()
export class InterGroupService {
  constructor( @InjectModel(InterGroup.name) private readonly interGroupModel: Model<InterGroupDocument>,
      @InjectModel(InvitationInterGroup.name) private readonly invitationModel: Model<InvitationInterGroupDocument>,
      private readonly groupService: GroupService) {}

  async getInterGroups(): Promise<InterGroup[]> {
    const interGroups = await this.interGroupModel
      .find({ active: true })
      .populate('groupOne')
      .populate('groupTwo')
      .populate('meetingPlaceOne')
      .populate('meetingPlaceTwo')
      .exec();
    if (!interGroups) {
      throw new HttpException('Not Found', 404);
    }
    return interGroups;
  }

  async getInterGroup(interGroupID: any): Promise<InterGroup> {
    try {
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupID }, { active: true });
      console.log(interGroup);
      return interGroup;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createInterGroup(interGroupDTO: InterGroupDTO): Promise<string> {
    try {
      const interGroup = await new this.interGroupModel(interGroupDTO);
      await interGroup.save();
      return 'Inter Group created';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateInterGroup(interGroupID: any, data: UpdateInterGroupDTO): Promise<InterGroup | undefined> {
    try {
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupID });
      const updatedInterGroup = await this.interGroupModel.updateOne({ ...data });
      const interGroupUpdated = await this.interGroupModel.findOne({ _id: interGroupID });
      return interGroupUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteInterGroup(interGroupID: any): Promise<string> {
    try {
      await this.interGroupModel.deleteOne({ _id: interGroupID });
      return 'Inter Group deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }

   async sendInvitationToOtherGroup(data: RequestGroupToGroupDTO) {
     try {
       const { adminSender, groupSender, groupReceiver } = data;
       const groupExistAndAdmin = await this.groupService.getGroup({ active: true, _id: groupSender, admin: adminSender });
       if (!groupExistAndAdmin) throw new Error ('This group does not exist or the user is not the admin');
       const alreadyInIntergroup = await this.interGroupModel.find({ active: true, groupOne: groupSender || groupReceiver});
       if (alreadyInIntergroup.length > 0) throw new Error('The group(s) are already in an intergroup');
       const newInvitation = new this.invitationModel(data);
       await newInvitation.save();
       return newInvitation;
     } catch (error) {
       throw new Error(error.message);
     }
   }

   async getInvitationGroupToGroup(groupReceiver: any) {
     try {
       const invitations = await this.invitationModel.find({ groupReceiver, success: false, active: true}).populate('adminSender').populate('groupSender');
       if(invitations.length < 0) throw new Error ('This group does not has requests');
       return invitations;
     } catch (error) {
       throw new Error(error.message);
     }
   }

   async acceptInvitationGroupToGroup(data: AceptOrRefuseDTO) {
     try {
       const { invitationId, userId  } = data;
       const invitation = await this.invitationModel.findOne({ _id: invitationId });
       if (!invitation) throw new Error('This invitation does not exist');
       if (invitation.success) throw new Error('This invitation is already success');
       if(!invitation.active) throw new Error('This invitation was canceled');
       const groupReceivInvitation = await this.groupService.getGroup({ _id: invitation.groupReceiver });
       console.log('admin of this group', groupReceivInvitation.admin);
       console.log('userId', userId);
       if (groupReceivInvitation.admin != userId) throw new Error ('This user is not the admin of this group');
       invitation.success = true;
       await invitation.save();
       const createInterGroup = await this.createInterGroup(data)
       return createInterGroup
     } catch (error) {
       throw new Error(error.message)
     }
   }

   async refuseInvitationGroupToGroup(data: AceptOrRefuseDTO) {
     try {
       const { invitationId, userId } = data;
       const invitation = await this.invitationModel.findOne({ _id: invitationId });
       if (!invitation) throw new Error('This invitation does not exist');
       if (!invitation.active) throw new Error('This invitation was canceled');
       const group = await this.groupService.getGroup({ _id: invitation.groupReceiver });
       if (group.admin != userId) throw new Error('This user is not the admin of this group');
       invitation.active = false;
       await invitation.save();
       return group;
     } catch (error) {
       throw new Error(error.message)
     }
   }

}
