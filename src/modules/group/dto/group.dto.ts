import { Meeting } from '../../meeting-place/schema/meetingPlace.schema';
import { User } from '../../users/schema/users.schema';
import * as mongoose from 'mongoose';

export class GroupDTO {
  readonly name: string;
  readonly startDate: Date;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne: mongoose.Types.ObjectId;
  readonly meetingPlaceTwo?: mongoose.Types.ObjectId;
  readonly description: string;
  readonly photos?: string;
  readonly integrants: User;
}

export class UpdateGroupDTO {
  readonly name?: string;
  readonly startDate?: Date;
  readonly startTime?: Date;
  readonly endTime?: Date;
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne?: mongoose.Types.ObjectId;
  readonly meetingPlaceTwo?: mongoose.Types.ObjectId;
  readonly description?: string;
  readonly photos?: string;
  readonly integrants: mongoose.Types.ObjectId[];
}

export class ActivityDTO {
  readonly tipeOfActivity: string;
}

export interface ActivityInterface extends Document {
  readonly tipeOfActivity: string;
}
