import {
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { BoardsService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FavoriteBoardsService } from '../favoriteBoard/favoriteBoards.service';
import { IContext } from 'src/commons/type/context';

/**
 * Board GraphQL API Resolver
 * @APIs `searchBoards`, `fetchBoards`, 'fetchBoardsASC', `fetchBoard`, `fetchBoardWithDeleted`,
 * `searchMyBoards`, 'createBoard', 'updateBoard', 'deleteBoard', 'restoreBoard'
 */
@Resolver()
export class Boardsresolver {
  constructor(
    private readonly boardsService: BoardsService, //
    private readonly elasticsearchService: ElasticsearchService,
    private readonly favoriteBoardsService: FavoriteBoardsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /** 게시글을 검색어로 조회 */
  @Query(() => [Board])
  async searchBoards(
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
        fields: ['title'],
      });

      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search, arrayBoard, { ttl: 20 });

      return arrayBoard;
    }
  }

  /** 게시글 전체 조회 내림차순 */
  @Query(() => [Board])
  fetchBoards(
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.boardsService.findBoardAll({ page });
  }

  /** 게시글 생성일 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [Board])
  fetchBoardsCreatedAt(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.boardsService.findBoardsCreatedAt({
      page,
      sortBy,
    });
  }

  /** 게시글 좋아요 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [Board])
  fetchBoardsLikeCount(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.boardsService.findBoardsLikeCount({
      page,
      sortBy,
    });
  }

  /** 게시글 하나 조회 */
  @Query(() => Board)
  fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.findBoardOne({ boardId });
  }

  /** 삭제된 게시글 조회 */
  @Query(() => [Board])
  fetchBoardWithDeleted() {
    return this.boardsService.WithBoardDelete();
  }

  /** 로그인한 본인 게시글만 조회 */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  async searchMyBoards(
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

      await this.cacheManager.set(search, arrayBoard, { ttl: 20 });

      return arrayBoard;
    }
  }

  // 태그로 조회

  // 게시글 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async createBoard(
    @Context() context: IContext,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    const user = context.req.user.email;
    return await this.boardsService.create({ user, createBoardInput });
  }

  /** 게시글 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Context() context: IContext,
    @Args('boardId') boardId: string,
    @Args('nickName') nickName: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    const board = await this.boardsService.findBoardOne({ boardId });
    const user = context.req.user.id;

    if (!board)
      throw new UnprocessableEntityException('등록된 게시글이 없습니다.');

    if (!user)
      throw new ConflictException(`${nickName}님의 게시글이 아닙니다.`);

    return this.boardsService.update({ boardId, updateBoardInput });
  }

  /** 게시글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.delete({ boardId });
  }

  /** 게시글 복구 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  restoreBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.restore({ boardId });
  }
}
