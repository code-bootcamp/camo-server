import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCafe } from './entities/favoriteCafe.entity';

@Injectable()
export class FavoriteCafesService {
  constructor(
    @InjectRepository(FavoriteCafe)
    private readonly favoriteCafeService: Repository<FavoriteCafe>,
  ) {}
}
