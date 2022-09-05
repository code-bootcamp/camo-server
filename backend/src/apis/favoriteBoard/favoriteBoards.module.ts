import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteBoardsResolver } from './favoriteBoards.resolver';
import { favoriteBoard } from './entities/favoriteBoard.entity';
import { FavoriteBoardsService } from './favoriteBoards.service';
import { User } from '../users/entites/user.entity';
import { Board } from '../boards/entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      favoriteBoard, //
      User,
      Board,
    ]),
  ],
  providers: [
    FavoriteBoardsResolver, //
    FavoriteBoardsService,
  ],
})
export class FavoriteBoardsModule {}
