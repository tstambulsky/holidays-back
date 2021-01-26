import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';

export class GroupDTO {
  readonly name: string;
  readonly startDate: Date;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly description: string;
  readonly photos?: string;
}

export class UpdateGroupDTO {
  readonly name?: string;
  readonly startDate?: Date;
  readonly startTime?: Date;
  readonly endTime?: Date;
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne?: Meeting;
  readonly meetingPlaceTwo?: Meeting;
  readonly description?: string;
  readonly photos?: string;
}
