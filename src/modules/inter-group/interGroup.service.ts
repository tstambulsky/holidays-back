import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterGroup, InterGroupDocument } from './schema/interGroup.schema';
import {
  InterGroupDTO,
  UpdateInterGroupDTO,
  RequestGroupToGroupDTO,
  AceptOrRefuseDTO,
  newProposalDto,
  acceptOrRefuseProposalDto
} from './dto/interGroup.dto';
import { InvitationInterGroup, InvitationInterGroupDocument } from './schema/invitationInterGroup.schema';
import { GroupService } from '../group/group.service';
import { Proposal, ProposalDocument } from './schema/proposal.schema';
import { User } from '../users/schema/users.schema';

@Injectable()
export class InterGroupService {
  constructor(
    @InjectModel(InterGroup.name) private readonly interGroupModel: Model<InterGroupDocument>,
    @InjectModel(InvitationInterGroup.name) private readonly invitationModel: Model<InvitationInterGroupDocument>,
    @InjectModel(Proposal.name) private readonly proposalModel: Model<ProposalDocument>,
    private readonly groupService: GroupService
  ) {}

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

  async createInterGroup(interGroupDTO: InterGroupDTO): Promise<InterGroup> {
    try {
      const interGroup = new this.interGroupModel(interGroupDTO);
      await interGroup.save();
      return interGroup._id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateInterGroup(interGroupID: any, data: UpdateInterGroupDTO, currentUser: any): Promise<InterGroup | undefined> {
    try {
      const userId = currentUser._id;
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupID });
      if (interGroup.groupOne.admin !== userId || interGroup.groupTwo.admin !== userId) throw new HttpException('You dont have privileges to do this action', 404);
      const updatedInterGroup = await this.interGroupModel.updateOne({ ...data });
      const interGroupUpdated = await this.interGroupModel.findOne({ _id: interGroupID });
      return interGroupUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveInterGroup(interGroupID: any): Promise<string> {
    try {
      const interGroup = await this.interGroupModel.findById(interGroupID);
      if (!interGroup) {
        throw new HttpException('Not Found', 404);
      }
      interGroup.active = false;
      await interGroup.save();
      return 'InterGroup change to inactive';
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

  async sendInvitationToOtherGroup(data: RequestGroupToGroupDTO, currentUser: any) {
    try {
      const { groupSender, groupReceiver } = data;
      const userID = currentUser._id;
      const groupExistAndAdmin = await this.groupService.getGroup({ active: true, _id: groupSender, admin: userID });
      if (!groupExistAndAdmin) throw new Error('This group does not exist or the user is not the admin');
      const alreadyInIntergroup = await this.interGroupModel.find({ active: true, groupOne: groupSender || groupReceiver });
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
      const invitations = await this.invitationModel
        .find({ groupReceiver, success: false, active: true })
        .populate('adminSender')
        .populate('groupSender');
      if (invitations.length < 0) throw new Error('This group does not has requests');
      return invitations;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptInvitationGroupToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId, groupOne, groupTwo } = data;
      const userID = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId });
      if (!invitation) throw new Error('This invitation does not exist');
      if (invitation.success) throw new Error('This invitation is already success');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const groupReceivInvitation = await this.groupService.getGroup({ _id: invitation.groupReceiver });
      if (groupReceivInvitation.admin != userID) throw new Error('You are not the admin of the group.');
      invitation.success = true;
      await invitation.save();
      const createInterGroup = await new this.interGroupModel({
        groupOne,
        groupTwo,
        active: false
      });
      return await createInterGroup.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refuseInvitationGroupToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId } = data;
      const userID = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId });
      if (!invitation) throw new Error('This invitation does not exist');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const group = await this.groupService.getGroup({ _id: invitation.groupReceiver });
      if (group.admin != userID) throw new Error('You are not the admin of the group.');
      invitation.active = false;
      await invitation.save();
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async proposalDateAndPlace(data: newProposalDto, currentUser: any) {
    try {
      const { interGroup, groupSender } = data;
      const userId = currentUser._id;
      const obtainInterGroup = await this.interGroupModel.findOne({ _id: interGroup });
      if (!obtainInterGroup) throw new Error('This Inter group does not exist');
      if (obtainInterGroup.confirmed) throw new Error('This Inter group is already confirmed');
      const groupSend = await this.groupService.getGroup(groupSender);
      if (groupSend.admin != userId) throw new Error('You are not the admin of the group.');
      const proposal = new this.proposalModel(data);
      await proposal.save();
      return 'Proposal Sended';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProposalsInterGroup(interGroupId: any) {
    try {
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupId });
      if (!interGroup) throw new Error('This Inter group does not exist');
      const proposals = await this.proposalModel
        .findOne({ interGroup: interGroupId, active: true, success: false })
        .populate('proposalPlace')
        .populate('interGroup');
      return proposals;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptOrRefuseProposal(data: acceptOrRefuseProposalDto, currentUser: any) {
    try {
      const { proposalId, accept } = data;
      const userID = currentUser._id;
      const proposal = await this.proposalModel.findOne({ _id: proposalId });
      if (!proposal) throw new Error('This proposal does not exist');
      const groupReceiver = await this.groupService.getGroup(proposal.groupReceiver);
      if (groupReceiver.admin != userID) throw new Error('You are not the admin of the group.');
      proposal.active = false;
      proposal.success = accept;
      await proposal.save();
      if (accept) {
        const intergroup = await this.interGroupModel.findOne({ _id: proposal.interGroup });
        intergroup.startDate = proposal.proposalDate;
        intergroup.meetingPlaceOne = proposal.proposalPlace;
        intergroup.confirmed = true;
        await intergroup.save();
      }
      return proposal;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMyIntergroups(userId: any) {
    try {
      const allIntergroups = await this.interGroupModel.find({ confirmed: true, active: true }).populate('groupOne').populate('groupTwo');
      let intergroups = [];
      //@ts-ignore
      const intergroupsOne = allIntergroups.filter((data) => data.groupOne.integrants.some((user: User) => user._id === userId));
      //@ts-ignore
      const intergroupsTwo = allIntergroups.filter((data) => data.groupTwo.integrants.some((user: User) => user._id === userId));
      intergroups = [...intergroupsOne, ...intergroupsTwo];
      if (intergroups.length < 0) throw new Error('This user does not has intergroups');
      return intergroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
