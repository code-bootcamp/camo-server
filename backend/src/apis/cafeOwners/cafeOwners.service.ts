import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeOwner } from './entities/cafeOwner.entity';

@Injectable()
export class CafeOwnersService {
  constructor() {}
}
