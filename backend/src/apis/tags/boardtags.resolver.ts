import { Resolver } from '@nestjs/graphql';
import { BoardTagsService } from './boardtags.service';

@Resolver()
export class BoardTagsResolver {
  constructor(
    private readonly boardTagsService: BoardTagsService, //
  ) {}
}
