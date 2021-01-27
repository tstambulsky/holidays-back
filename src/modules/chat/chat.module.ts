import { Module } from '@nestjs/common';
import { GroupChatModule } from './group-chat/group-chat.module';
import { InterGroupChatModule } from './inter-group-chat/inter-group-chat.module';

@Module({
  imports: [GroupChatModule, InterGroupChatModule]
})
export class ChatModule {}
