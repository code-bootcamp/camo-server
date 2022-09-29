import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { Repository } from 'typeorm';
import { CafeBoardsService } from './cafeBoards.service';
import { CreateCafeBoardInput } from './dto/createCafeBoard.input';
import { UpdateCafeBoardInput } from './dto/updateCafeBoard.input';
import { CafeBoard } from './entities/cafeBoard.entity';

/**
 * CafeBoard(카페 소개글) GrqphQL API Resolver
 * @APIs
 * 'searchCafeList'
 * 'fetchCafeListNumber',
 * 'fetchCafeList',
 * 'fetchCafeLists',
 * 'fetchCafeListsCreatedAt',
 * 'fetchCafeListsFavoriteCafe',
 * 'createCafeList',
 * 'updateCafeList',
 * 'deleteCafeList',
 * 'restoreCafeList'
 */
@Resolver()
export class CafeBoardsResolver {
  constructor(
    private readonly cafeBoardsService: CafeBoardsService, //
    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,
  ) {}

  /** 카페 소개글 검색 */
  @Query(() => [CafeBoard])
  async searchCafeList(
    @Args({ name: 'search_cafelist', nullable: true }) search_cafelist: string,
  ) {
    return this.cafeBoardsService.search({ search_cafelist });
  }

  /** 카페 소개글 개수 조회 */
  @Query(() => Int)
  async fetchCafeListNumber() {
    const result = await this.cafeBoardsRepository.find({});
    return result.length;
  }

  /** 카페게시글 하나 조회 */
  @Query(() => CafeBoard)
  fetchCafeList(
    @Args('cafeBoardId') cafeBoardId: string, //
  ) {
    return this.cafeBoardsService.findOne({ cafeBoardId });
  }

  /** 카페 게시글 전체 조회 */
  @Query(() => [CafeBoard])
  async fetchCafeLists(
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.cafeBoardsService.findAll({ page });
  }

  /** 카페 소개글 생성일 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [CafeBoard])
  fetchCafeListsCreatedAt(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.cafeBoardsService.findByCreatedAt({
      page,
      sortBy,
    });
  }

  /** 카페 게시글 찜 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [CafeBoard])
  fetchCafeListsFavoriteCafe(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.cafeBoardsService.findByfavoriteCafeCount({
      page,
      sortBy,
    });
  }

  /** 카페 소개글 생성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeBoard)
  async createCafeList(
    @Args('createCafeListInput') createCafeListInput: CreateCafeBoardInput,
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return await this.cafeBoardsService.create({
      user,
      createCafeListInput,
    });
  }

  /** 카페 소개글 업데이트 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeBoard)
  async updateCafeList(
    @Args('cafeBoardId') cafeBoardId: string,
    @Args('updateCafeListInput') updateCafeListInput: UpdateCafeBoardInput,
    @Context() context: IContext,
  ) {
    const userEmail = context.req.user.email;
    const result = await this.cafeBoardsService.update({
      userEmail,
      cafeBoardId,
      updateCafeListInput,
    });
    return result;
  }

  /** 카페 소개글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeList(
    @Args('cafeBoardId') cafeBoardId: string, //
    @Context() context: IContext,
  ) {
    return this.cafeBoardsService.delete({ context, cafeBoardId });
  }

  /** Admin */

  /** 카페 소개글 복구 */
  @Mutation(() => Boolean)
  restoreCafeList(
    @Args('cafeBoardId') cafeBoardId: string, //
  ) {
    return this.cafeBoardsService.restore({ cafeBoardId });
  }
}
