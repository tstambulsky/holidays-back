import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { InterGroup, InterGroupSchema } from '../inter-group/schema/interGroup.schema';
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
    InterGroupModule,
    UsersModule
  ],
  controllers: [GroupController],
  providers: [GroupService, InterGroupService, UsersService]
})
export class GroupModule {}
