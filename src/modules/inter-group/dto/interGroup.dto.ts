import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { Group } from '../../group/schema/group.schema';

export class InterGroupDTO {
  readonly groupOne: Group;
  readonly groupTwo: Group;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly photos?: string;
  readonly active: boolean;
}

export class UpdateInterGroupDTO {
  readonly groupOne?: Group;
  readonly groupTwo?: Group;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly photos?: string;
  readonly active?: boolean;
}
