import { Resolver } from '@nestjs/graphql';
import { FavoriteBoardsService } from './favoriteBoards.service';

@Resolver()
export class FavoriteBoardsResolver {
  constructor(
    private readonly favoriteBoardsService: FavoriteBoardsService, //
  ) {}
}
