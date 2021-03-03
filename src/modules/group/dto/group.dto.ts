import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { User } from '../../users/schema/users.schema';
import { Group } from '../schema/group.schema';
import { Invitation } from '../schema/invitation.schema';
import { TypeOfActivity } from '../../typeOfActivity/schema/typeOfActivity.schema';

export class GroupDTO {
  readonly name: string;
  readonly startDate: Date;
  readonly endDate?: string;
  readonly typeOfActivity: TypeOfActivity;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly address: any;
  readonly description: string;
  readonly photos?: string;
  readonly integrants: User;
  readonly active: boolean;
}

export class UpdateGroupDTO {
  readonly name?: string;
  readonly startDate?: Date;
  readonly endDate?: string;
  readonly typeOfActivity?: TypeOfActivity;
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

export class RequestToGroupDTO {
  readonly group: Group;
  readonly user: User;
  readonly fromAdmin?: boolean;
}

export class AceptOrRefuseDTO {
  readonly invitationId: Invitation;
  readonly success?: boolean;
}
