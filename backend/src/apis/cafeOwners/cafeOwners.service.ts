import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeOwner } from './entites/cafeOwner.entity';

@Injectable()
export class CafeOwnersService {
  constructor(
    @InjectRepository(CafeOwner)
    private readonly cafeOwnersRepository: Repository<CafeOwner>,
  ) {}
}
