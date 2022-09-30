import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteBoardsResolver } from './favoriteBoards.resolver';
import { favoriteBoard } from './entities/favoriteBoard.entity';
import { FavoriteBoardsService } from './favoriteBoards.service';
import { User } from '../users/entites/user.entity';
import { FreeBoard } from '../freeboards/entities/freeBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      favoriteBoard, //
      User,
      FreeBoard,
    ]),
  ],
  providers: [
    FavoriteBoardsResolver, //
    FavoriteBoardsService,
  ],
})
export class FavoriteBoardsModule {}
