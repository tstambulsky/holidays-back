import { Document } from 'mongoose';
import { User } from '../../users/schema/users.schema';
import { Group } from '../../group/schema/group.schema';
import { InterGroup } from '../../inter-group/schema/interGroup.schema';

export class MessageDTO extends Document {
  readonly content: string;
  readonly group?: Group;
  readonly interGroup?: InterGroup;
  readonly adminUser?: User;

}
