import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CafeReservationsService } from './cafeReservations.service';
import { CreateReservationInput } from './dto/createReservation.input';
import { CafeReservation } from './entities/cafeReservations.entity';

/**
 * CafeReservation GraphQL API Resolver
 * @APIs
 * 'createCafeReservation',
 * 'fetchCafeReservation'
 */
@Resolver()
export class CafeReservationsResolver {
  constructor(
    private readonly cafeReservationsService: CafeReservationsService, //
  ) {}

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeReservation)
  createCafeReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.cafeReservationsService.create({
      createReservationInput,
    });
  }

  // 카페 예약 내역 조회
  @Query(() => CafeReservation)
  fetchCafeReservation(
    @Args('cafeReservationId') cafeReservationId: string, //
  ) {
    return this.cafeReservationsService.find({ cafeReservationId });
  }

  @Query(() => [CafeReservation])
  fetchMyCafeReservation(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    return this.cafeReservationsService.findUser({ page });
  }
  @Query(() => Number)
  fetchCafeReservationNumber(
    @Args('userId') userId: string, //
  ) {
    return this.cafeReservationsService.findbyUser({ userId });
  }
}
