import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { FavoriteBoardsService } from './favoriteBoards.service';

@Resolver()
export class FavoriteBoardsResolver {
  constructor(
    private readonly favoriteBoardsService: FavoriteBoardsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleLikeFeed(
    @Args('boardId') boardId: string,
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    const result = this.favoriteBoardsService.like({ userId, boardId });
    return result;
  }
}
