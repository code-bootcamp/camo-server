import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteBoardsResolver } from './favoriteBoards.resolver';
import { favoriteBoard } from './entities/favoriteBoard.entity';
import { FavoriteBoardsService } from './favoriteBoards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      favoriteBoard, //
    ]),
  ],
  providers: [
    FavoriteBoardsResolver, //
    FavoriteBoardsService,
  ],
})
export class FavoriteBoardsModule {}
