import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardTag } from './entities/tag.entity';

@Injectable()
export class BoardTagsService {
  constructor(
    @InjectRepository(BoardTag)
    private readonly boardTagsRepository: Repository<BoardTag>,
  ) {}
}
