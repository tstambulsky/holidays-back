import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { User } from '../../users/schema/users.schema';
import { Group } from '../schema/group.schema';
import * as mongoose from 'mongoose';
import { Invitation } from '../schema/invitation.schema';

export class GroupDTO {
  readonly name: string;
  readonly startDate: Date;
  readonly startTime: string;
  readonly endTime?: string;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly address: any;
  readonly description: string;
  readonly photos?: string;
  readonly integrants: User;
  readonly active: boolean;
  readonly admin: User;
}

export class UpdateGroupDTO {
  readonly name?: string;
  readonly startDate?: Date;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly address?: any;
  readonly description?: string;
  readonly photos?: string;
  readonly integrants: User;
  readonly active?: boolean;
}

export class QueryDTO {
  readonly gender: string;
  readonly age: number;
  readonly name: string;
  readonly activity: string;
}

export class SendInvitationDTO {
  readonly groupOne: Group;
  readonly groupTwo: Group;
  readonly admin: User;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly photos?: string;
  readonly active?: boolean;
}

export class RequestToGroupDTO {
  readonly group: Group;
  readonly user: User;
}

export class AceptOrRefuseDTO {
  readonly invitationId: Invitation;
  readonly userId: User;
}
