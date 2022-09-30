import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/image.service';
import { FreeBoardTag } from '../freeBoardTags/entities/freeBoardTag.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { FreeBoardsresolver } from './freeBoards.resolver';
import { FreeBoardsService } from './freeBoards.service';
import { FreeBoard } from './entities/freeBoard.entity';
import { Like } from '../likes/entities/like.entity';
import { LikesService } from '../likes/likes.service';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FreeBoard, //
      User,
      Like,
      Image,
      FreeBoardTag,
      CafeBoard,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    FreeBoardsresolver, //
    FreeBoardsService,
    UsersService,
    ImagesService,
    LikesService,
  ],
})
export class FreeBoardsmodule {}
