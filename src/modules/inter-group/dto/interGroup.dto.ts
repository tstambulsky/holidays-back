import * as mongoose from 'mongoose';
import { Group } from '../../group/schema/group.schema';
import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';

export class InterGroupDTO {
  readonly groupOne: Group;
  readonly groupTwo: Group;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly typeOfActivity: string;
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
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly photos?: string;
  readonly active?: boolean;
}
