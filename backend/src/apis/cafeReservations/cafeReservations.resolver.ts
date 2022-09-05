import { Mutation, Resolver } from '@nestjs/graphql';
import { CafeReservationsService } from './cafeReservations.service';
import { CafeReservation } from './entities/cafeReservations.entity';

@Resolver()
export class CafeReservationsResolver {
  constructor(
    private readonly cafeReservationsService: CafeReservationsService, //
  ) {}

  @Mutation(() => CafeReservation)
  createCafeReservation() {
    //
  }
}
