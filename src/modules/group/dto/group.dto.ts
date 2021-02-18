import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { User } from '../../users/schema/users.schema';
import * as mongoose from 'mongoose';

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

export class ActivityDTO {
  readonly tipeOfActivity: string;
}

export interface ActivityInterface extends Document {
  readonly tipeOfActivity: string;
}

export class queryDTO {
  readonly gender: string;
  readonly age: number;
  readonly name: string;
  readonly activity: string;
}
