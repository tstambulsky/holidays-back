import { Module, forwardRef } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { UsersService } from '../users/users.service';
import { InterGroupModule } from '../inter-group/interGroup.module';
import { InterGroupService } from '../inter-group/interGroup.service';
import { UsersModule } from '../users/users.module';
import { Invitation, InvitationSchema } from './schema/invitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Invitation.name, schema: InvitationSchema }
    ]),
    forwardRef(() => UsersModule) 
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {}
