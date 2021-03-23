import { User } from '../../users/schema/users.schema';

export class NotificationDto {
  readonly to?: User;
  readonly title: string;
  readonly body: string;
}
