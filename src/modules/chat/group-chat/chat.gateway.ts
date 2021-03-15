import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message_group')
  async listenForMessages(@MessageBody() data: MessageDTO, @ConnectedSocket() socket: Socket) {
    const { content, group } = data;
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessageGroup(content, author, group);

    this.server.sockets.emit('receive_message_group', message);
  }

  @SubscribeMessage('request_all_messages_group')
  async requestAllMessages(@MessageBody() data: MessageDTO, @ConnectedSocket() socket: Socket) {
    const { group } = data;
    const author = await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessagesGroup(group, author);

    socket.emit('send_all_mesages_group', messages);
  }
}
