import { Resolver } from '@nestjs/graphql';
import { CafeReservationsService } from './cafeReservations.service';

@Resolver()
export class CafeReservationsResolver {
  constructor(
    private readonly cafeReservationsService: CafeReservationsService, //
  ) {}
}
