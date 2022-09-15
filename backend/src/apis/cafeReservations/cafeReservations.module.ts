import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeList } from '../cafeLists/entities/cafeList.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { CafeReservationsResolver } from './cafeReservations.resolver';
import { CafeReservationsService } from './cafeReservations.service';
import { CafeReservation } from './entities/cafeReservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeReservation, //
      User,
      CafeList,
    ]),
  ],
  providers: [
    CafeReservationsResolver, //
    CafeReservationsService,
    UsersService,
  ],
})
export class CafeReservationsMoudule {}
