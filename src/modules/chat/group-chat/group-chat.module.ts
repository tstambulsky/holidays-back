import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { GroupModule } from '../../group/group.module';
import { InterGroupModule } from '../../inter-group/interGroup.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), AuthModule, UsersModule, GroupModule, InterGroupModule],
  providers: [ChatGateway, ChatService]
})
export class GroupChatModule {}
