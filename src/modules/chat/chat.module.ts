import { Module, forwardRef, HttpModule } from '@nestjs/common';
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
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema }
    ]),
    AuthModule,
    forwardRef(() => UsersModule),
    forwardRef(() => GroupModule),
    forwardRef(() => InterGroupModule),
    HttpModule,
    forwardRef(() => NotificationModule)
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
