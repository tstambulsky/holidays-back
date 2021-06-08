import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { User } from '../../users/schema/users.schema';
import { Group } from '../schema/group.schema';
import { Invitation } from '../schema/invitation.schema';
import { TypeOfActivity } from '../../typeOfActivity/schema/typeOfActivity.schema';

export class GroupDTO {
  readonly name: string;
  startDate: Date;
  endDate?: Date;
  readonly typeOfActivity: TypeOfActivity;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly description: string;
  readonly photos?: string[];
  readonly integrants?: User;
  readonly active: boolean;
}

export class UpdateGroupDTO {
  readonly name?: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly typeOfActivity?: TypeOfActivity;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly description?: string;
  readonly photos?: string[];
  readonly integrants: User;
  readonly active?: boolean;
}

export class QueryDTO {
  readonly gender: string;
  readonly age: number;
  readonly name: string;
  readonly activity: string;
  readonly from: number;
  readonly to: number;
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

export class SearchByDistanceDto {
  readonly distance: number;
}

export class searchByIntegrants {
  readonly integrants: number;
}

export class NewAdminDto {
  readonly user: User;
  readonly groupId: Group;
}

export class EditPhotosDto {
  readonly groupId: Group;
  readonly photos: string[];
}

export class FiltersDTO {
  readonly age: any;
  readonly gender: any;
  readonly distance: any;
}

