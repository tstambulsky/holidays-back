import * as mongoose from 'mongoose';
export class InterGroupDTO {
  readonly groupOne: mongoose.Types.ObjectId;
  readonly groupTwo: mongoose.Types.ObjectId;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly typeOfActivity: string;
  readonly meetingPlaceOne: mongoose.Types.ObjectId;
  readonly meetingPlaceTwo?: mongoose.Types.ObjectId;
  readonly photos?: string;
  readonly active: boolean;
}

export class UpdateInterGroupDTO {
  readonly groupOne?: mongoose.Types.ObjectId;
  readonly groupTwo?: mongoose.Types.ObjectId;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly typeOfActivity?: string;
  readonly meetingPlaceOne: mongoose.Types.ObjectId;
  readonly meetingPlaceTwo?: mongoose.Types.ObjectId;
  readonly photos?: string;
  readonly active?: boolean;
}
