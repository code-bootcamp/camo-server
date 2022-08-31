import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entites/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
