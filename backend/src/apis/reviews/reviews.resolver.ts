import { Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}
}
