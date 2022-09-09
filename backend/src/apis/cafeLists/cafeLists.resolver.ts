import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CafeListsService } from './cafeLists.service';
import { CreateCafeListInput } from './dto/createCafeList.input';
import { UpdateCafeListInput } from './dto/updateCafeList.input';
import { CafeList } from './entities/cafeList.entity';

@Resolver()
export class CafeListsResolver {
  constructor(
    private readonly cafeListsService: CafeListsService, //
  ) {}

  @Query(() => CafeList)
  fetchCafeList() {
    return true;
  }

  @Query(() => [CafeList])
  fetchCafeLists() {
    return true;
  }

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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeList)
  updateCafeList(
    @Args('cafeListId') cafeListId: string,
    @Args('updateCafeListInput') updateCafeListInput: UpdateCafeListInput,
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;

    return true;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteCafeList(
    @Args('cafeListId') cafeListId: string, //
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    return await this.cafeListsService.delete({ userId, cafeListId });
  }
}
