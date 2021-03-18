import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@WebSocketGateway({transports: ['websocket',  'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'], cors : {
  origin: process.env.URL,
  credentials: true
},
allowEIO3: true})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

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

  @SubscribeMessage('send_message_inter_group')
  async listenForMessagesInter(@MessageBody() data: MessageDTO, @ConnectedSocket() socket: Socket) {
    const { content, group, interGroup } = data;
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessageInterGroup(content, author, group, interGroup);

    await this.server.sockets.emit('receive_message_inter_group', message);
  }

  @SubscribeMessage('request_all_messages_inter_group')
  async requestAllMessagesInter(@MessageBody() data: MessageDTO, @ConnectedSocket() socket: Socket) {
    const { group, interGroup } = data;
    const author = await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessagesInterGroup(author, group, interGroup);

    socket.emit('send_all_mesages_inter_group', messages);
  }

  @SubscribeMessage('send_message_admin')
  async listenForMessagesAdmin(@MessageBody() data: MessageDTO, @ConnectedSocket() socket: Socket) {
    const { content, adminUser, group } = data;
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessageAdmin(content, author, adminUser, group);

    await this.server.sockets.emit('receive_message_admin', message);
  }

  @SubscribeMessage('request_all_messages_admin')
  async requestAllMessagesAdmin(@MessageBody() data: MessageDTO, @ConnectedSocket() socket: Socket) {
    const { group, adminUser } = data;
    const author = await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessagesAdmin(group, adminUser);

    socket.emit('send_all_mesages_admin', messages);
  }
}
