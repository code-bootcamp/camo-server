import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeReservaion } from '../cafeReservations/entities/cafeReservations.entity';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../users/entites/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      User,
      CafeReservaion,
    ]),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService,
    IamportService,
  ],
})
export class PaymentsModule {}
