import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCafe } from './entities/favoriteCafe.entity';
import { FavoriteCafesResolver } from './favoriteCafes.resolver';
import { FavoriteCafesService } from './favoriteCafes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteCafe, //
    ]),
  ],
  providers: [
    FavoriteCafesResolver, //
    FavoriteCafesService,
  ],
})
export class FavoriteCafesModule {}
