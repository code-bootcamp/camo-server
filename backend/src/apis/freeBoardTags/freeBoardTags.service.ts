import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreeBoardTag } from './entities/freeBoardTag.entity';

@Injectable()
export class FreeBoardTagsService {
  constructor(
    @InjectRepository(FreeBoardTag)
    private readonly freeBoardTagsRepository: Repository<FreeBoardTag>,
  ) {}
}
