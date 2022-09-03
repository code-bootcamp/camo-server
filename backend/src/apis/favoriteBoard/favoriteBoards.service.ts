import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { favoriteBoard } from './entities/favoriteBoard.entity';

@Injectable()
export class FavoriteBoardsService {
  constructor(
    @InjectRepository(favoriteBoard)
    private readonly favoriteBoardsRepository: Repository<favoriteBoard>,
  ) {}
}
