import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { BoardsService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';
import { IContext } from 'src/commons/type/context';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';

/**
 * Board GraphQL API Resolver
 * @APIs
 * 'fetchBoardsNumber',
 * `searchBoards`,
 * `fetchBoards`,
 * 'fetchBoardsASC',
 * `fetchBoard`,
 * `fetchBoardWithDeleted`,
 * `searchMyBoards`,
 * 'createBoard',
 * 'updateBoard',
 * 'deleteBoard',
 * 'restoreBoard'
 */
@Resolver()
export class Boardsresolver {
  constructor(
    private readonly boardsService: BoardsService, //
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  /** 게시글 개수 조회 */
  @Query(() => Int)
  async fetchBoardsNumber() {
    const result = await this.boardRepository.find({});
    return result.length;
  }

  /** 게시글을 검색어로 조회 */
  @Query(() => [Board])
  async searchBoards(
    @Args({ name: 'search_board', nullable: true }) search_board: string, //
  ) {
    return this.boardsService.search({ search_board });
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
    return this.boardsService.searchUsersBoard({ search });
  }

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
    return this.boardsService.updateBoard({
      boardId,
      nickName,
      updateBoardInput,
      context,
    });
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

  @Query(() => Number)
  fetchUsermyBoardNumber(
    @Args('userId') userId: string, //
  ) {
    return this.boardsService.findBoardByUser({ userId });
  }

  @Query(() => User)
  fetchUserMyBoard1(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.boardsService.findBoardByUserWithPage({ userId, page });
  }
}
