import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UsersService } from '../users/users.service';
import { BoardsService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FavoriteBoardsService } from '../favoriteBoard/favoriteBoards.service';

@Resolver()
export class Boardsresolver {
  constructor(
    private readonly boardsService: BoardsService, //

    private readonly usersService: UsersService,

    private readonly elasticsearchService: ElasticsearchService,

    private readonly favoriteBoardsService: FavoriteBoardsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 전체 게시글 조회 엘라스틱서치
  @Query(() => [Board])
  async searchBoards(@Args({ name: 'search', nullable: true }) search: string) {
    const checkRedis = await this.cacheManager.get(search);

    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'search-board',
        query: {
          term: { name: search },
        },
      });

      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search, arrayBoard, { ttl: 3000 });

      return arrayBoard;
    }
  }

  // 전체 게시글 조회
  @Query(() => [Board])
  fetchBoards() {
    return this.boardsService.findBoardAll();
  }

  // 원하는 게시글 조회
  @Query(() => Board)
  fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.findBoardOne({ boardId });
  }

  // 삭제된 게시글 조회
  @Query(() => [Board])
  fetchBoardWithDeleted() {
    return this.boardsService.WithBoardDelete();
  }

  // 로그인한 본인 게시글만 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Board)
  async fetchMyBoards(
    @Args({ name: 'search', nullable: true }) search: string, //
  ) {
    const checkRedis = await this.cacheManager.get(search);

    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'search-board',
        query: {
          term: { name: search },
        },
      });

      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search, arrayBoard, { ttl: 3000 });

      return arrayBoard;
    }
  }

  // 태그로 조회

  // 게시글 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    return this.boardsService.create({ createBoardInput });
  }

  // 게시글 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('userId') userId: string, //
    @Args('nickName') nickName: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    const board = await this.boardsService.findBoardOne({ boardId });

    if (!board)
      throw new UnprocessableEntityException('등록된 게시글이 없습니다.');

    const user = await this.usersService.findOne({ userId });
    if (!user)
      throw new UnprocessableEntityException(
        `${nickName}님의 게시글이 아닙니다.`,
      );

    return this.boardsService.update({ boardId, updateBoardInput });
  }

  // 게시글 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.delete({ boardId });
  }

  /** like 갯수 조회 */
  @Query(() => Board)
  fetchLike(
    @Args('boardId') boardId: string, //
  ) {
    return this.favoriteBoardsService.findLike({ boardId });
  }
}
