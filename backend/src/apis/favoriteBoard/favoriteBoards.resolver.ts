import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Board } from '../boards/entities/board.entity';
import { FavoriteBoardsService } from './favoriteBoards.service';

@Resolver()
export class FavoriteBoardsResolver {
  constructor(
    private readonly favoriteBoardsService: FavoriteBoardsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  toggleLikeFeed(
    @Args('email') email: string,
    @Args('boardId') boardId: string,
  ) {
    return this.favoriteBoardsService.like({ email, boardId });
  }
}
