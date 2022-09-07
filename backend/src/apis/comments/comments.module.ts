import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from '../boards/board.service';
import { Board } from '../boards/entities/board.entity';
import { favoriteBoard } from '../favoriteBoard/entities/favoriteBoard.entity';
import { Image } from '../images/entities/image.entity';
import { BoardTagsService } from '../tags/boardtags.service';
import { BoardTag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comment } from './entites/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment, //
      Board,
      User,
      BoardTag,
      Image,
      favoriteBoard,
    ]),
  ],
  providers: [
    CommentsResolver, //
    CommentsService,
    UsersService,
    BoardsService,
    BoardTagsService,
  ],
})
export class CommentsModule {}
