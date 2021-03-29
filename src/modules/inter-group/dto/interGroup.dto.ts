import { Group } from '../../group/schema/group.schema';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { TypeOfActivity } from '../../typeOfActivity/schema/typeOfActivity.schema';
import { InterGroup } from '../schema/interGroup.schema';
import { InvitationInterGroup } from '../schema/invitationInterGroup.schema';
import { Proposal } from '../schema/proposal.schema';

export class InterGroupDTO {
  readonly groupOne?: Group;
  readonly groupTwo?: Group;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly typeOfActivity?: TypeOfActivity;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly photos?: string;
  readonly active?: boolean;
}

export class UpdateInterGroupDTO {
  readonly groupOne?: Group;
  readonly groupTwo?: Group;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly typeOfActivity?: TypeOfActivity;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly photos?: string;
  readonly active?: boolean;
}

export class RequestGroupToGroupDTO {
  readonly groupSender: Group;
  readonly groupReceiver: Group;
}

export class AceptOrRefuseDTO {
  readonly invitationId: InvitationInterGroup;
}

export class newProposalDto {
  readonly interGroup: InterGroup;
  readonly proposalStartDate: Date;
  readonly proposalEndDate: Date;
  readonly proposalPlace: Meeting;
  readonly groupSender: Group;
  readonly groupReceiver: Group;
}

export class acceptOrRefuseProposalDto {
  readonly proposalId: Proposal;
  readonly accept: boolean;
}
