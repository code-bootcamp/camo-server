import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { FreeBoardsService } from './freeBoards.service';
import { CreateFreeBoardInput } from './dto/createFreeBoard.input';
import { UpdateFreeBoardInput } from './dto/updateBoard.input';
import { FreeBoard } from './entities/freeBoard.entity';
import { IContext } from 'src/commons/type/context';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * FreeBoard GraphQL API Resolver
 * @APIs
 * 'searchBoards',
 * 'fetchBoardsNumber',
 * 'fetchBoard'
 * 'fetchBoards',
 * 'fetchBoardsCreatedAt',
 * `fetchBoardsLikeCount`,
 * `searchMyBoards`,
 * 'createBoard',
 * 'updateBoard',
 * 'deleteBoard',
 * 'restoreBoard'
 * 'fetchUsermyBoardNumber'
 * 'fetchUserMyBoard'
 * 'fetchBoardWithDeleted',
 */
@Resolver()
export class FreeBoardsresolver {
  constructor(
    private readonly freeBoardsService: FreeBoardsService, //

    @InjectRepository(FreeBoard)
    private readonly freeboardsRepository: Repository<FreeBoard>,
  ) {}

  /** 게시글을 검색어로 조회 */
  @Query(() => [FreeBoard])
  async searchBoards(
    @Args({ name: 'search_board', nullable: true }) search_board: string, //
  ) {
    return this.freeBoardsService.search({ search_board });
  }

  /** 게시글 개수 조회 */
  @Query(() => Int)
  async fetchBoardsNumber() {
    const result = await this.freeboardsRepository.find({});
    return result.length;
  }

  /** 게시글 하나 조회 */
  @Query(() => FreeBoard)
  fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.freeBoardsService.findBoardOne({ boardId });
  }

  /** 게시글 전체 내림차순 조회 */
  @Query(() => [FreeBoard])
  fetchBoards(
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.freeBoardsService.findAll({ page });
  }

  /** 게시글 생성일 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [FreeBoard])
  fetchBoardsCreatedAt(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.freeBoardsService.findBoardsCreatedAt({
      page,
      sortBy,
    });
  }

  /** 게시글 좋아요 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [FreeBoard])
  fetchBoardsLikeCount(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.freeBoardsService.findBoardsLikeCount({
      page,
      sortBy,
    });
  }

  /** 로그인한 본인 게시글만 조회 */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [FreeBoard])
  async searchMyBoards(
    @Args({ name: 'search', nullable: true }) search: string, //
  ) {
    return this.freeBoardsService.searchUsersBoard({ search });
  }

  /** 게시글 생성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => FreeBoard)
  async createBoard(
    @Context() context: IContext,
    @Args('createBoardInput') createBoardInput: CreateFreeBoardInput,
  ) {
    const user = context.req.user.email;
    return await this.freeBoardsService.create({ user, createBoardInput });
  }

  /** 게시글 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => FreeBoard)
  async updateBoard(
    @Context() context: IContext,
    @Args('boardId') boardId: string,
    @Args('nickName') nickName: string,
    @Args('updateFreeBoardInput') updateFreeBoardInput: UpdateFreeBoardInput,
  ) {
    return this.freeBoardsService.updateBoard({
      boardId,
      nickName,
      updateFreeBoardInput,
      context,
    });
  }

  /** 게시글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.freeBoardsService.delete({ boardId });
  }

  /** 게시글 복구 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  restoreBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.freeBoardsService.restore({ boardId });
  }

  /** 유저가 작성한 게시글 조회 */
  @Query(() => Number)
  fetchUsermyBoardNumber(
    @Args('userId') userId: string, //
  ) {
    return this.freeBoardsService.findBoardByUser({ userId });
  }

  /** 로그인한 본인 게시글만 조회 */
  @Query(() => [FreeBoard])
  fetchUserMyBoard(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    return this.freeBoardsService.findBoardByUserWithPage({ userId, page });
  }

  /** 삭제된 게시글 조회 */
  @Query(() => [FreeBoard])
  fetchBoardWithDeleted() {
    return this.freeBoardsService.WithBoardDelete();
  }
}
