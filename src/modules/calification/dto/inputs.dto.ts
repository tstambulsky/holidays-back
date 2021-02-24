import { InterGroup } from 'src/modules/inter-group/schema/interGroup.schema';
import { User } from 'src/modules/users/schema/users.schema';

export interface CalificationDTO {
  readonly success: boolean;
  readonly toUser: User;
  readonly fromUser: User;
  readonly interGroup: InterGroup;
  readonly comment: string;
}
