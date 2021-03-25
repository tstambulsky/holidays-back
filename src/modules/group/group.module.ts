import { Module, forwardRef } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { Invitation, InvitationSchema } from './schema/invitation.schema';
import { ChatModule } from '../chat/chat.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Invitation.name, schema: InvitationSchema }
    ]),
    forwardRef(() => UsersModule),
    CloudinaryModule,
    forwardRef(() => ChatModule)
  ],
  controllers: [GroupController],
  providers: [GroupService, NotificationService],
  exports: [GroupService]
})
export class GroupModule {}
