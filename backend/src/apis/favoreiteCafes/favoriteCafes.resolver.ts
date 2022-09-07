import { Resolver } from '@nestjs/graphql';
import { FavoriteCafesService } from './favoriteCafes.service';

@Resolver()
export class FavoriteCafesResolver {
  constructor(
    private readonly favoriteCafesService: FavoriteCafesService, //
  ) {}
}
