import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeReservation } from './entities/cafeReservations.entity';

@Injectable()
export class CafeReservationsService {
  constructor(
    @InjectRepository(CafeReservation)
    private readonly cafeReservationsRepository: Repository<CafeReservation>,
  ) {}
}
