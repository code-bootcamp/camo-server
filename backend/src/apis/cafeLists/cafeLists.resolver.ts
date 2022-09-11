import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { Repository } from 'typeorm';
import { CafeListsService } from './cafeLists.service';
import { CreateCafeListInput } from './dto/createCafeList.input';
import { UpdateCafeListInput } from './dto/updateCafeList.input';
import { CafeList } from './entities/cafeList.entity';

/**
 * CafeList(카페 소개글) GrqphQL API Resolver
 * @APIs 'fetchCafeListNumber', 'fetchCafeList', 'fetchCafeLists', 'fetchCafeListsCreatedAt', 'fetchCafeListsFavoriteCafe', 'createCafeList', 'updateCafeList',
 * 'deleteCafeList', 'restoreCafeList'
 */
@Resolver()
export class CafeListsResolver {
  constructor(
    private readonly cafeListsService: CafeListsService, //
    @InjectRepository(CafeList)
    private readonly cafeListRepository: Repository<CafeList>,
  ) {}

  /** 카페 소개글 개수 조회 */
  @Query(() => Int)
  async fetchCafeListNumber() {
    const result = await this.cafeListRepository.find({});
    return result.length;
  }

  /** 카페게시글 하나 조회 */
  @Query(() => CafeList)
  fetchCafeList(
    @Args('cafeListId') cafeListId: string, //
  ) {
    return this.cafeListsService.findOne({ cafeListId });
  }

  /** 카페 게시글 전체 조회 */
  @Query(() => [CafeList])
  async fetchCafeLists(
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.cafeListsService.findAll({ page });
  }

  /** 카페 소개글 생성일 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [CafeList])
  fetchCafeListsCreatedAt(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.cafeListsService.findByCreatedAt({
      page,
      sortBy,
    });
  }

  /** 카페 게시글 찜 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [CafeList])
  fetchCafeListsFavoriteCafe(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.cafeListsService.findByfavoriteCafeCount({
      page,
      sortBy,
    });
  }

  /** 카페 소개글 생성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeList)
  async createCafeList(
    @Args('createCafeListInput') createCafeListInput: CreateCafeListInput,
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    const result = await this.cafeListsService.create({
      userId,
      createCafeListInput,
    });
    return result;
  }

  /** 카페 소개글 업데이트 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeList)
  async updateCafeList(
    @Args('cafeListId') cafeListId: string,
    @Args('updateCafeListInput') updateCafeListInput: UpdateCafeListInput,
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    const result = await this.cafeListsService.update({
      userId,
      cafeListId,
      updateCafeListInput,
    });
    return result;
  }

  /** 카페 소개글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeList(
    @Args('cafeListId') cafeListId: string, //
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    return this.cafeListsService.delete({ userId, cafeListId });
  }

  /** 카페 소개글 복구 */
  @Mutation(() => Boolean)
  restoreCafeList(
    @Args('cafeListId') cafeListId: string, //
  ) {
    return this.cafeListsService.restore({ cafeListId });
  }
}
