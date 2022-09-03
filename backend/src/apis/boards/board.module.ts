import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comment.entity';
import { favoriteBoard } from '../favoriteBoard/entities/favoriteBoard.entity';
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
    ]),
  ],
  providers: [
    Boardsresolver, //
    BoardsService,
    UsersService,
  ],
})
export class Boardmodule {}
