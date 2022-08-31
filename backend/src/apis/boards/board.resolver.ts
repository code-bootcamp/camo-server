import { Resolver } from '@nestjs/graphql';
import { BoardService } from './board.service';

@Resolver()
export class Boardresolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}
}
