import { Resolver } from '@nestjs/graphql';
import { CafeListsService } from './cafeLists.service';

@Resolver()
export class CafeListsResolver {
  constructor(
    private readonly cafeListsService: CafeListsService, //
  ) {}
}
