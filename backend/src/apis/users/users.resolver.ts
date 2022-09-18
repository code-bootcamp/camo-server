import { ConflictException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUser.input';
import { UsersService } from './users.service';
import { User } from './entites/user.entity';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { Roles } from 'src/commons/auth/roles.decorator';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { CreateUserInput } from './dto/createUser.input';
import { USER_ROLE } from 'src/commons/type/user';
import { CreateCafeOwnerInput } from './dto/createCafeOwner.input';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  /** 회원 아이디 찾기 */
  @Query(() => User)
  fetchUserByEmail(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    return this.usersService.findUserByPhoneNumber({ phoneNumber });
  }

  /** 모든 유저 조회 로그인 API 테스트용*/
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginedUser(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    return this.usersService.findOne({ userId });
  }

  /** 모든 유저 조회 */
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  fetchUserbyId(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.findOne({ userId });
  }

  @Query(() => User)
  fetchUserMyBoard(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.usersService.findAllByUser({ userId, page });
  }

  /** 개별 유저 조회 */
  @Query(() => User)
  fetchUserbyEmail(
    @Args('email') email: string, //
  ) {
    return this.usersService.findOneUser({ email });
  }

  /** 회원가입시 중복 아이디 확인*/
  @Query(() => Boolean)
  async checkUserEmail(
    @Args('email') email: string, //
  ) {
    const userEmail = await this.usersService.findOneUser({ email });
    if (userEmail) throw new ConflictException('이미 사용되고 있는 ID입니다.');
    return true;
  }

  /** 일반 유저 회원 가입 */
  @Mutation(() => User)
  async createUser(
    @Args('CreateUserInput') createUserInput: CreateUserInput, //
  ) {
    const role = USER_ROLE.USER;
    return this.usersService.create({
      role,
      ...createUserInput,
    });
  }

  /** 카페 사업자 회원 가입 */
  @Mutation(() => User)
  async createCafeOwner(
    @Args('CreateCafeOwnerInput') createCafeOwnerInput: CreateCafeOwnerInput, //
  ) {
    const role = USER_ROLE.CAFEOWNER;
    return this.usersService.create({
      role,
      ...createCafeOwnerInput,
    });
  }

  /** 로그인한 회원 정보 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateLoginUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
    @Context() context: IContext,
  ) {
    const email = context.req.user.email;
    return this.usersService.updateUser({ email, ...updateUserInput });
  }

  /** 회원 비밀번호 찾기 */
  @Mutation(() => User)
  updateUserPassword(
    @Args('email') email: string, // 1번째 페이지(가지고 있다가)
    @Args('password') password: string, // 2번째 페이지 API
  ) {
    return this.usersService.updatePassword({ email, password });
  }

  /** 유저 회원 탈퇴 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(
    @Args('password') password: string, //
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    return this.usersService.delete({ password, userId });
  }

  @Query(() => User)
  fetchReservation(
    @Args('userId') userId: string, //
  ) {
    //
  }

  //----------------------------------------------------------------------

  /** for Admin 유저 복구 */
  @Mutation(() => Boolean)
  restoreUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.restore({ email });
  }

  /** for Admin 삭제12된 유저 조회 */
  @Query(() => [User])
  fetchUserWithDeleted() {
    return this.usersService.WithDelete();
  }

  // Role Guard 테스트실
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  @Query(() => User)
  async roleGuardUser(
    @Args('userId') userId: string, //
  ) {
    return await this.usersService.findOne({ userId });
  }

  @UseGuards(JwtAccessStrategy)
  @UseGuards(RolesGuard)
  @Roles('CAFEOWNER')
  @Query(() => User)
  async roleGuardCafeOwner(
    @Args('userId') userId: string, //
  ) {
    return await this.usersService.findOne({ userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Query(() => User)
  async roleGuardAdmin(
    @Args('userId') userId: string, //
  ) {
    return await this.usersService.findOne({ userId });
  }
}
