import {
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUser.input';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entites/user.entity';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { Roles } from 'src/commons/auth/roles.decorator';
import { RolesGuard } from 'src/commons/auth/roles.guard';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

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

  /** 개별 유저 조회 */
  @Query(() => User)
  fetchUser(
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

  /** 회원 가입 */
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('nickName') nickName: string,
  ) {
    const secret = Number(process.env.HASH_SECRET);
    const hashedPassword = await bcrypt.hash(password, secret);

    return this.usersService.create({
      email,
      hashedPassword,
      name,
      phoneNumber,
      nickName,
    });
  }

  /** 로그인한 회원 정보 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateLoginUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
    @Context() context: IContext,
  ) {
    const password = updateUserInput.password;
    const email = context.req.user.email;

    const user = await this.usersService.findOneUser({ email });
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const loginhash = await bcrypt.hash(
      password,
      Number(process.env.HASH_SECRET),
    );
    return this.usersService.update({ email, updateUserInput, loginhash });
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

  //----------------------------------------------------------------------

  /** for Admin 유저 복구 */
  @Mutation(() => Boolean)
  restoreUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.restore({ email });
  }

  /** for Admin 삭제된 유저 조회 */
  @Query(() => [User])
  fetchUserWithDeleted() {
    return this.usersService.WithDelete();
  }

  // Role Guard 테스트실
  @UseGuards(RolesGuard)
  @Roles('user')
  @Query(() => User)
  async roleGuardUser(
    @Args('userId') userId: string, //
  ) {
    return await this.usersService.findOne({ userId });
  }

  @UseGuards(RolesGuard)
  @Roles('cafeOwner')
  @Query(() => User)
  async roleGuardCafeOwner(
    @Args('userId') userId: string, //
  ) {
    return await this.usersService.findOne({ userId });
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Query(() => User)
  async roleGuardAdmin(
    @Args('userId') userId: string, //
  ) {
    return await this.usersService.findOne({ userId });
  }
}
