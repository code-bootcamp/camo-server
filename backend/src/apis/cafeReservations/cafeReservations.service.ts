import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeReservaion } from './entities/cafeReservations.entity';

@Injectable()
export class CafeReservationsService {
  constructor(
    @InjectRepository(CafeReservaion)
    private readonly cafeReservationsRepository: Repository<CafeReservaion>,
  ) {}
}
