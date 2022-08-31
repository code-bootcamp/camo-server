import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewPoint } from './entites/reviewPoint.entity';

@Injectable()
export class ReviewsPointsService {
  constructor(
    @InjectRepository(ReviewPoint)
    private readonly reviewsPointsRepository: Repository<ReviewPoint>,
  ) {}
}
