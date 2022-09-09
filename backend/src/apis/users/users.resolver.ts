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

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}
  /** 모든 유저 조회 로그인 API 테스트용*/
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginedUser(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    const result = await this.usersService.findOne({ userId });
    return result;
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
    // @Args('password') password: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
    @Context() context: IContext,
  ) {
    const password = updateUserInput.password;
    const email = context.req.user.email;
    // 1. 로그인 (이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findOneUser({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const loginhash = await bcrypt.hash(
      password,
      Number(process.env.HASH_SECRET),
    );
    // // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면 에러 던지기
    // const isAuth = await bcrypt.compare(password, user.password);

    // if (!isAuth)
    //   throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    return this.usersService.update({ email, updateUserInput, loginhash });
  }

  /** 유저 회원 탈퇴 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.delete({ email });
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
}
