import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/entites/comment.entity';
import { favoriteBoard } from '../favoriteBoard/entities/favoriteBoard.entity';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/image.service';
import { BoardTag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { Boardsresolver } from './board.resolver';
import { BoardsService } from './board.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board, //
      BoardTag,
      User,
      Comment,
      favoriteBoard,
      Image,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    Boardsresolver, //
    BoardsService,
    UsersService,
    ImagesService,
  ],
})
export class Boardmodule {}
