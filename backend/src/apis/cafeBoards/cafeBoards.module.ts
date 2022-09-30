import { Module } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { CafeListTag } from '../cafeListTags/entities/cafeListTag.entity';
import { CafeReservation } from '../cafeReservations/entities/cafeReservations.entity';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/image.service';
import { Like } from '../likes/entities/like.entity';
import { Review } from '../reviews/entites/review.entity';
import { User } from '../users/entites/user.entity';
import { UsersResolver } from '../users/users.resolver';
import { UsersService } from '../users/users.service';
import { CafeBoardsResolver } from './cafeBoards.resolver';
import { CafeBoardsService } from './cafeBoards.service';
import { CafeBoard } from './entities/cafeBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeBoard, //
      Like,
      Review,
      Image,
      CafeListTag,
      User,
      CafeReservation,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    CafeBoardsModule, //
    CafeBoardsService,
    CafeBoardsResolver,
    UsersService,
    ImagesService,
    UsersResolver,
  ],
})
export class CafeBoardsModule {}
