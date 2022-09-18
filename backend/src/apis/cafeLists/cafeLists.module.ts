import { Module } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { CafeListImage } from '../cafeListImage/entities/cafeListImage.entity';
import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeReservation } from '../cafeReservations/entities/cafeReservations.entity';
import { FavoriteCafe } from '../favoreiteCafes/entities/favoriteCafe.entity';
import { Review } from '../reviews/entites/review.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { CafeListsResolver } from './cafeLists.resolver';
import { CafeListsService } from './cafeLists.service';
import { CafeList } from './entities/cafeList.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeList, //
      FavoriteCafe,
      Review,
      CafeListImage,
      CafeListTag,
      User,
      CafeReservation,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    CafeListsResolver, //
    CafeListsService,
    UsersService,
    // ElasticsearchService,
  ],
})
export class CafeListsModule {}
