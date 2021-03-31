import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
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
import { ChatService } from '../chat/chat.service';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

@Injectable()
export class InterGroupService {
  constructor(
    @InjectModel(InterGroup.name) private readonly interGroupModel: Model<InterGroupDocument>,
    @InjectModel(InvitationInterGroup.name) private readonly invitationModel: Model<InvitationInterGroupDocument>,
    @InjectModel(Proposal.name) private readonly proposalModel: Model<ProposalDocument>,
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService
  ) {}

  async getInterGroups(): Promise<InterGroup[]> {
    const interGroups = await this.interGroupModel
      .find({ active: true })
      .populate('groupSender')
      .populate('groupReceiver')
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
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupID, active: true });
      return interGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getInterGroupInactive(interGroupID: any): Promise<InterGroup> {
    try {
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupID });
      return interGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getInterGroupUsers(interGroupID: any, group: any): Promise<InterGroup> {
    try {
      const interGroup = await this.interGroupModel.findOne({
        _id: interGroupID,
        active: true,
        $or: [{ groupSender: group }, { groupReceiver: group }]
      });
      if (!interGroup) throw new HttpException('The user does not belong to the group/intergroup', 404);
      return interGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getInterGroupChat(group: any): Promise<InterGroup> {
    try {
      const id = group._id;
      const interGroup = await this.interGroupModel.findOne({ $or: [{ groupSender: id }, { groupReceiver: id }], confirmed: true });
      return interGroup;
    } catch (err) {
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
      if (interGroup.groupSender.admin !== userId || interGroup.groupReceiver.admin !== userId)
        throw new HttpException('You dont have privileges to do this action', 404);
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
      const { groupSender } = data;
      const userId = currentUser._id;
      const groupExistAndAdmin = await this.groupService.getGroup({ active: true, _id: groupSender, admin: userId });
      if (!groupExistAndAdmin) throw new Error('This group does not exist or the user is not the admin');
      // const alreadyInIntergroup = await this.interGroupModel.find({
      //   active: true,
      //   groupSender: groupSender || groupReceiver,
      //   confirmed: true
      // });
      // if (alreadyInIntergroup.length > 0) throw new Error('The group(s) are already in an intergroup');
      const newInvitation = new this.invitationModel(data);
      await newInvitation.save();
      const interGroupChat = await this.chatService.createInterGroupChatInvitation(newInvitation._id);
      await interGroupChat.save();
      console.log('chat', interGroupChat)
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
      const { invitationId } = data;
      const userID = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId });
      if (!invitation) throw new Error('This invitation does not exist');
      if (invitation.success) throw new Error('This invitation is already success');
      if (!invitation.active) throw new Error('This invitation was canceled');
      const groupReceivInvitation = await this.groupService.getGroup({ _id: invitation.groupReceiver });
      if (groupReceivInvitation.admin != userID) throw new Error('You are not the admin of the group.');
      invitation.success = true;
      invitation.active = false;
      await invitation.save();
      const groupSender = invitation.groupSender;
      const groupReceiver = invitation.groupReceiver;
      const firstGroup = await this.groupService.getGroup(groupSender);
      const secondGroup = await this.groupService.getGroup(groupReceiver);
      const createInterGroup = await new this.interGroupModel({
        groupSender,
        groupReceiver,
        name: `${firstGroup.name} + ${secondGroup.name}`,
        confirmed: true,
        active: false
      });
      await createInterGroup.save();
      const chat = await this.chatService.getInterGroupByInvitation(invitation._id);
      chat.interGroup = createInterGroup._id;
      chat.name = createInterGroup.name;
      chat.pending = false;
      await chat.save();
      return createInterGroup;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refuseInvitationGroupToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      const { invitationId } = data;
      const userID = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId });
      if (!invitation) throw new HttpException('This invitation does not exist', 404);
      if (!invitation.active) throw new HttpException('This invitation was canceled', 404);
      const group = await this.groupService.getGroup({ _id: invitation.groupReceiver });
      if (group.admin != userID) throw new HttpException('You are not the admin of the group.', 404);
      invitation.active = false;
      await invitation.save();
      const chat = await this.chatService.getInterGroupByInvitation(invitation._id);
      chat.pending = false;
      chat.setTimeAndPlace = false;
      chat.active = false;
      await chat.save();
      return group;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getInterGroupWithoutProposal(groupId: any) {
    try {
      const interGroup = await this.interGroupModel.findOne({
        active: false,
        confirmed: true,
        $or: [{ groupSender: groupId }, { groupReceiver: groupId }]
      });
      if (!interGroup) throw new HttpException('The intergroup does not exist or does not need proposals.', 404);
      return interGroup;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async proposalDateAndPlace(data: newProposalDto, currentUser: any) {
    try {
      const { interGroup } = data;
      const userId = currentUser._id;
      const obtainInterGroup = await this.interGroupModel.findOne({ _id: interGroup }).populate('groupSender').populate('groupReceiver');
      if (!obtainInterGroup) throw new Error('This Inter group does not exist');
      if (obtainInterGroup.active) throw new Error('This Inter group is already active');
      if (obtainInterGroup.groupSender.admin != userId) {
        if (obtainInterGroup.groupReceiver.admin != userId) {
        throw new Error('You are not the admin of the group.'); 
        }
      }
      if (obtainInterGroup.groupSender.admin == userId) {
      data.groupSender = obtainInterGroup.groupSender;
      data.groupReceiver = obtainInterGroup.groupReceiver;
      } if (obtainInterGroup.groupReceiver.admin == userId) {
      data.groupSender = obtainInterGroup.groupReceiver;
      data.groupReceiver = obtainInterGroup.groupSender;
      }
      const proposal = new this.proposalModel(data);
      if (!proposal.proposalEndDate) {
        proposal.proposalEndDate = moment(proposal.proposalStartDate).add(12, 'hours').format('YYYY-MM-DD HH:mm');
      }
      await proposal.save();
      const chat = await this.chatService.getInterGroup(obtainInterGroup._id);
      chat.place = true;
      chat.setTimeAndPlace = false;
      chat.pending = true;
      await chat.save();
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
      const userId = currentUser._id;
      const proposal = await this.proposalModel.findOne({ _id: proposalId }).populate('groupSender').populate('groupReceiver');
      if (!proposal) throw new Error('This proposal does not exist');
      if (proposal.groupReceiver.admin != userId) throw new Error('You are not the admin of the group.')
      proposal.active = false;
      proposal.success = accept;
      await proposal.save();
      if (accept) {
        const intergroup = await this.interGroupModel.findOne({ _id: proposal.interGroup });
        intergroup.startDate = proposal.proposalStartDate;
        intergroup.endDate = proposal.proposalEndDate;
        intergroup.meetingPlaceOne = proposal.proposalPlace;
        intergroup.active = true;
        await intergroup.save();
        const chat = await this.chatService.getInterGroup(proposal.interGroup);
        chat.place = false;
        await chat.save();
      } else {
        const chat = await this.chatService.getInterGroup(proposal.interGroup);
        chat.place = false;
        chat.setTimeAndPlace = true;
        await chat.save();
      }
      return proposal;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMyIntergroups(currentUser: any) {
    try {
      let groupId = [];
      let interGroups = [];

      const userInGroup = await this.groupService.getUserGroups(currentUser);

      userInGroup.forEach((element) => {
        groupId.push(element._id);
      });

      for await (let element of groupId) {
        const searchInterGroups = await this.interGroupModel.findOne({
          active: true,
          confirmed: true,
          $or: [{ groupSender: element }, { groupReceiver: element }]
        });
        if (searchInterGroups !== null) await interGroups.push({ searchInterGroups });
      }
      return await interGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMyIntergroupsNoActives(currentUser: any) {
    try {
      let groupId = [];
      let interGroups = [];
      let searchInterGroups;

      const userInGroup = await this.groupService.getUserGroups(currentUser);

      userInGroup.forEach((elements) => {
        groupId.push(elements._id);
      });

      for await (let element of groupId) {
        searchInterGroups = await this.invitationModel.findOne({
          $or: [{ groupSender: element }, { groupReceiver: element }]
        });
        if (searchInterGroups) interGroups.push({ searchInterGroups });
      }
      return interGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getInvitationId(invitationId: any) {
    try {
      const invitation = await this.invitationModel.findOne({ _id: invitationId });
      if (!invitation) throw new HttpException('Invitation does not exist', 404);
      return invitation;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
