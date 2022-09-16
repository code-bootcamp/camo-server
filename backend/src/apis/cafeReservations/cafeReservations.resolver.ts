import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
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

  //카페아이디
  // 인원
  // 예약금
  // 예약시간
  // 카페이름
}
