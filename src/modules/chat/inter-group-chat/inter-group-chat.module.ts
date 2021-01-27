import { Module } from '@nestjs/common';
import { InterGroupChatGateway } from './inter-group-chat.gateway';

@Module({
  providers: [InterGroupChatGateway]
})
export class InterGroupChatModule {}
