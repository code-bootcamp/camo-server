import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/type/context';
import { CafeReservationsService } from './cafeReservations.service';
import { CreateReservationInput } from './dto/createReservation.input';
import { CafeReservation } from './entities/cafeReservations.entity';

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
}
