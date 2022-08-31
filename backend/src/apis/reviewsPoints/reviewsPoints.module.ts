import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsPointsResolver } from './reviewsPoints.resolver';
import { ReviewsPointsService } from './reviewsPoints.service';
import { ReviewPoint } from './entites/reviewPoint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewPoint, //
    ]),
  ],
  providers: [
    ReviewsPointsResolver, //
    ReviewsPointsService,
  ],
})
export class ReviewsPointsMoudule {}
