import { Resolver } from '@nestjs/graphql';
import { CafeListTagsService } from './cafeListTags.service';

@Resolver()
export class CafeListTagsResolver {
  constructor(
    private readonly cafeListTagsService: CafeListTagsService, //
  ) {}
}
