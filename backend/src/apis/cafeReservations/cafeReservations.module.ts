import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeReservationsResolver } from './cafeReservations.resolver';
import { CafeReservationsService } from './cafeReservations.service';
import { CafeReservaion } from './entites/cafeReservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeReservaion, //
    ]),
  ],
  providers: [
    CafeReservationsResolver, //
    CafeReservationsService,
  ],
})
export class CafeReservationsMoudule {}
