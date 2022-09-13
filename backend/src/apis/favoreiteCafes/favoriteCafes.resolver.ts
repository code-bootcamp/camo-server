import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { FavoriteCafesService } from './favoriteCafes.service';

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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  fetchUserFavoriteCafe(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    return this.favoriteCafesService.findUserLike({ userId });
  }
}
