import { Resolver } from '@nestjs/graphql';
import { FreeBoardTagsService } from './freeBoardTags.service';

@Resolver()
export class FreeBoardTagsResolver {
  constructor(
    private readonly freeBoardTagsService: FreeBoardTagsService, //
  ) {}
}
