import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterGroupService } from './interGroup.service';
import { InterGroupController } from './interGroup.controller';
import { InterGroup, InterGroupSchema } from './schema/interGroup.schema';
import { GroupModule } from '../group/group.module';
import { InvitationInterGroup, InvitationInterGroupSchema } from './schema/invitationInterGroup.schema';
import { Proposal, ProposalSchema } from './schema/proposal.schema';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterGroup.name, schema: InterGroupSchema },
      { name: InvitationInterGroup.name, schema: InvitationInterGroupSchema },
      { name: Proposal.name, schema: ProposalSchema }
    ]),
    forwardRef(() => GroupModule),
    forwardRef(() => ChatModule),
    NotificationModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [InterGroupController],
  providers: [InterGroupService],
  exports: [InterGroupService]
})
export class InterGroupModule {}
