import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeList } from '../cafeLists/entities/cafeList.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { Review } from './entites/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User,
      CafeList,
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
    UsersService,
  ],
})
export class ReviewsModule {}
