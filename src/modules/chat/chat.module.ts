import { Module } from '@nestjs/common';
import { GroupChatModule } from './group-chat/group-chat.module';

@Module({
  imports: [GroupChatModule]
})
export class ChatModule {}
