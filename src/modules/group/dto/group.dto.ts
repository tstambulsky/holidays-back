import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { User } from '../../users/schema/users.schema';
import * as mongoose from 'mongoose';

export class GroupDTO {
  readonly name: string;
  readonly startDate: Date;
  readonly startTime: string;
  readonly endTime?: string;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne?: mongoose.Types.ObjectId;
  readonly meetingPlaceTwo?: mongoose.Types.ObjectId;
  readonly address: any;
  readonly description: string;
  readonly photos?: string;
  readonly integrants: mongoose.Types.ObjectId;
  readonly active: boolean;
}

export class UpdateGroupDTO {
  readonly name?: string;
  readonly startDate?: Date;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne?: mongoose.Types.ObjectId;
  readonly meetingPlaceTwo?: mongoose.Types.ObjectId;
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
