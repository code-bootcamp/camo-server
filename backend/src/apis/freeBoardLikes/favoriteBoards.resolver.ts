import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { favoriteBoard } from './entities/favoriteBoard.entity';
import { FavoriteBoardsService } from './favoriteBoards.service';

/**
 * Comment GrqphQL API Resolver
 * @APIs
 * 'toggleLikeFeed'
 * 'fetchFavoriteUser'
 */
@Resolver()
export class FavoriteBoardsResolver {
  constructor(
    private readonly favoriteBoardsService: FavoriteBoardsService, //
  ) {}

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => Boolean)
  // toggleLikeFeed(
  //   @Args('freeBoardId') freeBoardId: string,
  //   @Context() context: IContext,
  // ) {
  //   const userId = context.req.user.id;
  //   const result = this.favoriteBoardsService.cafeBoardlike({ userId, freeBoardId });
  //   return result;
  // }

  // @Query(() => [favoriteBoard])
  // fetchFavoriteUser(
  //   @Args('freeBoardId') freeBoardId: string, //
  // ) {
  //   return this.favoriteBoardsService.findAll({ freeBoardId });
  // }
}
