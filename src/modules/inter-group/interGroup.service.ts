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
  acceptOrRefuseProposalDto,
  acceptOrRefuseRepeat
} from './dto/interGroup.dto';
import { InvitationInterGroup, InvitationInterGroupDocument } from './schema/invitationInterGroup.schema';
import { GroupService } from '../group/group.service';
import { Proposal, ProposalDocument } from './schema/proposal.schema';
import { ChatService } from '../chat/chat.service';
import { NotificationService } from '../notification/notification.service';
import { UsersService } from '../users/users.service';
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

@Injectable()
export class InterGroupService {
  constructor(
    @InjectModel(InterGroup.name) private readonly interGroupModel: Model<InterGroupDocument>,
    @InjectModel(InvitationInterGroup.name) private readonly invitationModel: Model<InvitationInterGroupDocument>,
    @InjectModel(Proposal.name) private readonly proposalModel: Model<ProposalDocument>,
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
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

  async getInterGroupById(interGroupId: any) {
    try {
      let integrants = [];
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupId }).populate('groupSender').populate('groupReceiver').populate('meetingPlaceOne').populate('typeOfActivity');
      if (interGroup) {
        const groupOne = await this.groupService.getOneGroup({_id: interGroup.groupSender});
        if (groupOne) {
          const firstGroup = await this.groupService.getGroup(groupOne._id);
          integrants.push(firstGroup.integrants);
        }
        const groupTwo = await this.groupService.getOneGroup({_id: interGroup.groupReceiver});
        if (groupTwo) {
          const secondGroup = await this.groupService.getGroup(groupTwo._id);
          integrants.push(secondGroup.integrants);
        }
      }
      return {
        interGroup,
      integrants
    };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getInterGroupInactive(interGroupID: any): Promise<InterGroup> {
    try {
      const interGroup = await this.interGroupModel.findOne({ _id: interGroupID, active: false });
      if (!interGroup) throw new HttpException('Intergroup is active or does not exist', 404);
      return interGroup;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  async getInterGroupsInactive() {
    try {
      const interGroup = await this.interGroupModel.find({active: false });
      if (interGroup.length < 0) throw new HttpException('Does not have intergroups inactives.', 404);
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
      const chat = await this.chatService.getInterGroup(interGroupID);
      interGroup.active = false;
      interGroup.confirmed = false;
      await interGroup.save();
      chat.active = false;
      chat.save();
      return 'InterGroup change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendRepeatInterGroup(interGroupId: any, currentUser: any): Promise<string> {
    try {
      const userId = currentUser._id;
      const interGroup = await this.interGroupModel.findOne({_id: interGroupId});
      if (!interGroup) {
        throw new HttpException('Intergroup does not exist', 404);
      }
      const groupOne = await this.groupService.getGroup(interGroup.groupSender);
      const groupTwo = await this.groupService.getGroup(interGroup.groupReceiver);
       if (groupOne.admin != userId) {
        if (groupTwo.admin != userId) {
        throw new Error('You are not the admin of some group.'); 
        }
      }
      const invitation = await this.invitationModel.findOne({groupSender: interGroup.groupSender || interGroup.groupReceiver, groupReceiver: interGroup.groupReceiver || interGroup.groupSender});
      if (!invitation) throw new HttpException('Invitation does not exist', 404);
      if (groupOne.admin === userId) {
        invitation.groupSender = groupOne;
      } if (groupTwo.admin === userId) {
        invitation.groupSender = groupTwo;
        invitation.groupReceiver = groupOne;
      }
      invitation.sendAdminToRepeat = true;
      invitation.save();
      const chat = await this.chatService.getInterGroupInactive(interGroupId);
      chat.active = true;
      chat.setTimeAndPlace = true;
      chat.pending = true;
      chat.save();
      return 'Send invitation to the other group.';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async acceptInterGroupRepeat(data: acceptOrRefuseRepeat, currentUser: any) {
    try {
      const { interGroupId, accept } = data;
      const userId = currentUser._id;
       const interGroup = await this.interGroupModel.findOne({_id: interGroupId});
      if (!interGroup) {
        throw new HttpException('Intergroup does not exist', 404);
      }
      const chat = await this.chatService.getInterGroup(interGroupId);
      const invitation = await this.invitationModel.findOne({groupSender: interGroup.groupSender || interGroup.groupReceiver, groupReceiver: interGroup.groupReceiver || interGroup.groupSender});
      const proposal = await this.proposalModel.findOne({interGroup: interGroupId});
      const group = await this.groupService.getGroup(invitation.groupReceiver);
      if (!invitation) throw new HttpException('Invitation does not exist', 404);
      if (group.admin == userId) {
      if (accept) {
        invitation.acceptOtherAdmin = true;
        interGroup.confirmed = true;
        chat.pending = false;
        proposal.active = true;
        proposal.success = false;
      } else {
        interGroup.confirmed = false;
        chat.active = false;
        chat.pending = false;
        chat.setTimeAndPlace = false;
      }
      invitation.save();
      interGroup.save();
      chat.save();
      proposal.save();
      return interGroup;
    } else {
      throw new HttpException('You are not admin of the group', 404);
    }
    } catch (error) {
      throw new Error(error.message)
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
      let integrantsTwo = [];
      const { groupSender } = data;
      const userId = currentUser._id;
      const groupExistAndAdmin = await this.groupService.getGroup({ active: true, _id: groupSender});
      if (!groupExistAndAdmin) throw new Error('This group does not exist');
      // const alreadyInIntergroup = await this.interGroupModel.find({
      //   active: true,
      //   groupSender: groupSender || groupReceiver,
      //   confirmed: true
      // });
      // if (alreadyInIntergroup.length > 0) throw new Error('The group(s) are already in an intergroup');
      const groupOne = await this.groupService.getGroup(groupSender);
      const groupTwo: any = await this.groupService.getGroup(data.groupReceiver);
      groupTwo.integrants.forEach(element => {
        integrantsTwo.push(element._id);
      });
      const newInvitation = new this.invitationModel(data);
      await newInvitation.save();
      const interGroupChat = await this.chatService.createInterGroupChatInvitation(newInvitation._id);
      interGroupChat.name = `${groupOne.name} + ${groupTwo.name}`;
      await interGroupChat.save();
      await this.chatService.createInterGroupMessageThree(interGroupChat._id, groupOne.admin, groupOne.name);
      await this.chatService.createInterGroupMessageTwo(interGroupChat._id, groupOne.admin);
      for await (let users of integrantsTwo) {
        const user = await this.usersService.findOneUser({ _id: users, active: true });
        if (user.deviceToken) {
        await this.notificationService.sendInvitationToInterGroup(user.deviceToken, groupOne.name);
        }
      }
      await this.chatService.getAllChats(currentUser);
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
      let integrantsOne = [];
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
      const firstGroup: any = await this.groupService.getGroup(groupSender);
      firstGroup.integrants.forEach(element => {
         integrantsOne.push(element._id);
      });
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
      chat.setTimeAndPlace = true;
      chat.pending = false;
      await chat.save();
      await this.chatService.createInterGroupMessageFour(chat._id);
      for await (let users of integrantsOne) {
        const user = await this.usersService.findOneUser({ _id: users, active: true })
        if (user.deviceToken) {
        await this.notificationService.sendAcceptInterGroup(user.deviceToken, secondGroup.name);
      }
    }
      await this.chatService.getAllChats(currentUser);
      return {
        createInterGroup,
        response: "The changes to your invitation have been saved."
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refuseInvitationGroupToGroup(data: AceptOrRefuseDTO, currentUser: any) {
    try {
      let integrantsOne = [];
      const { invitationId } = data;
      const userID = currentUser._id;
      const invitation = await this.invitationModel.findOne({ _id: invitationId }).populate('groupSender');
      if (!invitation) throw new HttpException('This invitation does not exist', 404);
      if (!invitation.active) throw new HttpException('This invitation was canceled', 404);
      const group = await this.groupService.getGroup({ _id: invitation.groupReceiver });
      const groupOne: any = await this.groupService.getGroup({ _id: invitation.groupSender });
     groupOne.integrants.forEach(element => {
       integrantsOne.push(element._id);
     });
      if (group.admin != userID) throw new HttpException('You are not the admin of the group.', 404);
      invitation.active = false;
      await invitation.save();
      const chat = await this.chatService.getInterGroupByInvitation(invitation._id);
      chat.pending = false;
      chat.setTimeAndPlace = false;
      chat.active = false;
      await chat.save();
      for await (let users of integrantsOne) {
        const user = await this.usersService.findOneUser({ _id: users, active: true })
        if (user.deviceToken) {
        await this.notificationService.sendNoAcceptInterGroup(user.deviceToken, invitation.groupReceiver.name);
        }
      }
       await this.chatService.getAllChats(currentUser);
      return {
        group,
        response: "The changes to your invitation have been saved."
      };
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
      const date = moment().subtract(3, 'hours');
      const dateProposalPost = new Date(data.proposalStartDate);
      if (dateProposalPost <= date) {
        throw new Error('You cannot enter a past date or time.');
      };
      let integrantsTwo = [];
      const { interGroup } = data;
      const userId = currentUser._id;
      const obtainInterGroup = await this.interGroupModel.findOne({ _id: interGroup }).populate('groupSender').populate('groupReceiver');
      const groupTwo: any = await this.groupService.getGroup(obtainInterGroup.groupReceiver);
      groupTwo.integrants.forEach(element => {
        integrantsTwo.push(element._id);
      });
      if (!obtainInterGroup) throw new Error('This Intergroup does not exist');
      if (obtainInterGroup.active) throw new Error('This Intergroup is already active');
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
      chat.pending = false;
      chat.proposal = proposal._id;
      chat.meeting = proposal.proposalPlace;
      chat.dateProposal = proposal.proposalStartDate;
      await chat.save();
      for await (let users of integrantsTwo) {
        const user = await this.usersService.findOneUser({ _id: users, active: true })
        if (user.deviceToken) {
        await this.notificationService.sendProposal(user.deviceToken, proposal.groupSender.name);
      }
    }
      await this.chatService.getAllChats(currentUser);
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
        .populate('interGroup')
        .populate('groupSender')
        .populate('groupReceiver');
      return proposals;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptOrRefuseProposal(data: acceptOrRefuseProposalDto, currentUser: any) {
    try {
      let integrantsOne = [];
      let groupSender;
      let groupReceiver;
      const { proposalId, accept } = data;
      const userId = currentUser._id;
      const proposal: any = await this.proposalModel.findOne({ _id: proposalId }).populate('groupSender').populate('groupReceiver').populate('proposalPlace');
      proposal.groupSender.integrants.forEach(element => {
        integrantsOne.push(element._id)
      });
      if (!proposal) throw new Error('This proposal does not exist');
      if (proposal.groupReceiver.admin != userId) throw new Error('You are not the admin of the group.')
      proposal.active = false;
      proposal.success = accept;
      await proposal.save();
      if (accept) {
        const interGroup: any = await this.interGroupModel.findOne({ _id: proposal.interGroup }).populate('groupSender').populate('groupReceiver');
        groupSender = await this.groupService.getGroup(interGroup.groupSender._id);
        groupReceiver = await this.groupService.getGroup(interGroup.groupReceiver._id);
        const proposalEndDate = proposal.proposalEndDate.getFullYear() + '-' + (proposal.proposalEndDate.getMonth() + 1) + '-' + proposal.proposalEndDate.getDate();
        if (proposal.proposalEndDate.getFullYear() >= groupSender.endDate.getFullYear() && proposal.proposalEndDate.getMonth() >= groupSender.endDate.getMonth()
         && proposal.proposalEndDate.getDate() >= groupSender.endDate.getDate()) {
           groupSender.endDate = proposal.proposalEndDate;
           await groupSender.save();
         }
          if (proposal.proposalEndDate.getFullYear() >= groupReceiver.endDate.getFullYear() && proposal.proposalEndDate.getMonth() >= groupReceiver.endDate.getMonth()
         && proposal.proposalEndDate.getDate() >= groupReceiver.endDate.getDate()) {
           groupReceiver.endDate = proposal.proposalEndDate;
           await groupReceiver.save();
         }
        interGroup.startDate = proposal.proposalStartDate;
        interGroup.endDate = proposal.proposalEndDate;
        interGroup.meetingPlaceOne = proposal.proposalPlace;
        interGroup.tipeOfActivity = proposal.proposalActivity;
        interGroup.description = proposal.proposalDescription;
        interGroup.active = true;
        await interGroup.save();
        const chat = await this.chatService.getInterGroup(proposal.interGroup);
        chat.place = false;
        await chat.save();
        await this.chatService.createInterGroupMessageOne(chat._id, proposal.groupReceiver.admin);
        await this.chatService.createInterGroupMessageTwo(chat._id, proposal.groupReceiver.admin);
        await this.chatService.createInterGroupMessage(chat._id, proposal.groupReceiver.name);
        let hours = '' + interGroup.startDate.getHours();
          if (hours.length == 1) {
            hours = '0' + hours;
          }
          let minutes = '' + interGroup.startDate.getMinutes();
          if (minutes.length == 1) {
            minutes = '0' + minutes;
          }
        const time = hours+':'+minutes;
           await this.chatService.createMeetingMessage(interGroup.name, time, proposal.proposalPlace.name)
        for await (let users of integrantsOne) {
          const user = await this.usersService.findOneUser({ _id: users, active: true});
          if (user.deviceToken) {
          await this.notificationService.sendAcceptProposal(user.deviceToken, proposal.groupReceiver.name);
        }
      }
      } else {
        const chat = await this.chatService.getInterGroup(proposal.interGroup);
        chat.place = false;
        chat.setTimeAndPlace = true;
        await chat.save();
        for await (let users of integrantsOne) {
          const user = await this.usersService.findOneUser({_id: users, active: true})
          if (user.deviceToken) {
          await this.notificationService.sendNoAcceptPropoasl(user.deviceToken, proposal.groupReceiver.name);
        }
      }
      }
      await this.chatService.getAllChats(currentUser);
      return proposal;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMyIntergroups(currentUser: any) {
    try {
      let groupId = [];
      let interGroups = [];

      const userInGroup = await this.groupService.getUserGroupsAll(currentUser);

      userInGroup.forEach((element) => {
        groupId.push(element._id);
      });

      for await (let element of groupId) {
        const searchInterGroups = await this.interGroupModel.find({
          confirmed: true,
          $or: [{ groupSender: element }, { groupReceiver: element }]
        }).populate('groupSender').populate('groupReceiver').populate('meetingPlaceOne');
        if (searchInterGroups !== null) {
          interGroups.push({ searchInterGroups });
        }
      }
      return interGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getMyPreviousIntergroups(currentUser: any) {
    try {
      let groupId = [];
      let interGroups = [];

      const userInGroup: any = await this.groupService.getPreviousUserGroups(currentUser);

      userInGroup.forEach((element) => {
        groupId.push(element._id);
      });

      for await (let element of groupId) {
        const searchInterGroups = await this.interGroupModel.findOne({
          active: false,
          confirmed: true,
          $or: [{ groupSender: element }, { groupReceiver: element }]
        }).populate('groupSender').populate('groupReceiver');
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

      const userInGroup = await this.groupService.getUserGroupsAll(currentUser);

      userInGroup.forEach((elements) => {
        groupId.push(elements._id);
      });

      for await (let element of groupId) {
        const invitations = await this.invitationModel.find({
          $or: [{ groupSender: element }, { groupReceiver: element }]
        });
          invitations.forEach((invitation) => {
        if (invitation) {
          interGroups.push(invitation);
        }
      });
      };
      return interGroups;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  async getInvitationId(invitationId: any) {
    try {
      const invitation = await this.invitationModel.findOne({ _id: invitationId }).populate('groupSender').populate('groupReceiver').exec();
      if (!invitation) throw new HttpException('Invitation does not exist', 404);
      return invitation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

   async getInvitationToAcceptRepeat(currentUser: any) {
    try {
      let interGroupsInactives = [];
      const interGroups = await this.getMyPreviousIntergroups(currentUser);
      console.log(interGroups);
      for await (let interGroup of interGroups) {
        const interG = await this.invitationModel.findOne({ sendAdminToRepeat: true, $or:[{groupReceiver: interGroup.groupReceiver._id}, {groupReceiver: interGroup.groupSender._id}]});
        interGroupsInactives.push(interG);
      }
      console.log('intergs', interGroupsInactives)
      return interGroupsInactives;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async doTheMeeting(interGroupId: any, response: boolean ) {
    try {
      const interGroup = await this.interGroupModel.findOne({_id: interGroupId});
      if (response == true) {
        interGroup.doMeeting = true;
      } if (response == false) {
        interGroup.doMeeting = false;
      }
      interGroup.save();
      return 'Thanks for your reply.';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getInterGroupByGroups(groupSender: any, groupReceiver: any) {
    try {
      const interGroup = await this.interGroupModel.findOne({ groupSender, groupReceiver }).populate('groupSender').populate('groupReceiver');
      return interGroup;
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
