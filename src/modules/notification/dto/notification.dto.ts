import { Group } from 'src/modules/group/schema/group.schema';
import { User } from '../../users/schema/users.schema';

export class NotificationDto {
  readonly to?: User;
  readonly title: string;
  readonly body: string;
  readonly toAdmin?: User;
  readonly group?: Group;
}
