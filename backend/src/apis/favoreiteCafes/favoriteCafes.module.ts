import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { FavoriteCafe } from './entities/favoriteCafe.entity';
import { FavoriteCafesResolver } from './favoriteCafes.resolver';
import { FavoriteCafesService } from './favoriteCafes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteCafe, //
      User,
      CafeBoard,
    ]),
  ],
  providers: [
    FavoriteCafesResolver, //
    FavoriteCafesService,
    UsersService,
  ],
})
export class FavoriteCafesModule {}
