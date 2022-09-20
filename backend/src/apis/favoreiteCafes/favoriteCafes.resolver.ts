import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { FavoriteCafe } from './entities/favoriteCafe.entity';
import { FavoriteCafesService } from './favoriteCafes.service';

/**
 * FavoriteCafesResolver GraphQL API Resolver
 * @APIs
 * 'toggleFavoriteCafes'
 * 'fetchUserFavoriteCafe'
 * 'fetchFavoriteCafeNumber'
 * 'fetchFavoriteCafeUser'
 */
@Resolver()
export class FavoriteCafesResolver {
  constructor(
    private readonly favoriteCafesService: FavoriteCafesService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleFavoriteCafes(
    @Context() context: IContext,
    @Args('cafeListId') cafeListId: string,
  ) {
    const userId = context.req.user.id;
    return this.favoriteCafesService.like({ userId, cafeListId });
  }

  /** 유저가 찜한 카페 조회 */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [FavoriteCafe])
  fetchUserFavoriteCafe(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    return this.favoriteCafesService.findUserLike({ userId, page });
  }

  /** 유저가 찜한 카페 개수 조회 */
  @Query(() => Number)
  fetchFavoriteCafeNumber(
    @Args('userId') userId: string, //
  ) {
    return this.favoriteCafesService.findByUserId({ userId });
  }

  /** 유저가 찜한 카페 조회 */
  @Query(() => [FavoriteCafe])
  fetchFavoriteCafeUser(
    @Args('cafeListId') cafeListId: string, //
  ) {
    return this.favoriteCafesService.findAll({ cafeListId });
  }
}
