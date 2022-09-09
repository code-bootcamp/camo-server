import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeList } from '../cafeLists/entities/cafeList.entity';
import { User } from '../users/entites/user.entity';
import { FavoriteCafe } from './entities/favoriteCafe.entity';
import { FavoriteCafesResolver } from './favoriteCafes.resolver';
import { FavoriteCafesService } from './favoriteCafes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteCafe, //
      User,
      CafeList,
    ]),
  ],
  providers: [
    FavoriteCafesResolver, //
    FavoriteCafesService,
  ],
})
export class FavoriteCafesModule {}
