import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { InterGroupChatModule } from './inter-group-chat/inter-group-chat.module';

@Module({
  imports: [GroupChatModule, InterGroupChatModule, MessageModule]
})
export class ChatModule {}
