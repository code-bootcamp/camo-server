import { Resolver } from '@nestjs/graphql';
import { ReviewsPointsService } from './reviewsPoints.service';

@Resolver()
export class ReviewsPointsResolver {
  constructor(
    private readonly reviewsPointsService: ReviewsPointsService, //
  ) {}
}
