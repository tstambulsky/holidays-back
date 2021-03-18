import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GroupModule } from '../group/group.module';
import { ChatController } from './chat.controller';
import { InterGroupModule } from '../inter-group/interGroup.module';
import { Chat, ChatSchema } from './schema/chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
   AuthModule, UsersModule,  forwardRef(() => GroupModule), InterGroupModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
