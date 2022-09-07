import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeReservationsResolver } from './cafeReservations.resolver';
import { CafeReservationsService } from './cafeReservations.service';
import { CafeReservation } from './entities/cafeReservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeReservation, //
    ]),
  ],
  providers: [
    CafeReservationsResolver, //
    CafeReservationsService,
  ],
})
export class CafeReservationsMoudule {}
