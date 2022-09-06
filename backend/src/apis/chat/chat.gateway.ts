import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
@Injectable()
export class ChatGateway {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  wsClients = [];

  @SubscribeMessage('message')
  connectSomeone(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [nickName, room] = data;
    const receive = `${nickName}님이 입장했습니다.`;
    this.server.emit('receive' + room, receive);
    this.wsClients.push(client);
  }

  private broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id) continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('send')
  async sendMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [room, nickName, message] = data;
    const user = await this.usersRepository.findOne({
      where: { nickName: nickName },
    });

    await this.chatMessagesRepository.save({
      user: user,
      room: room,
      message: data[2],
    });

    this.broadcast(room, client, [nickName, message]);
  }
}
