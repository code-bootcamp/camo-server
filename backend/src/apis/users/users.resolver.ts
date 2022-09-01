import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
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

  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  fetchUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.findOne({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.findOne({ email });
  }

  @Query(() => [User])
  fetchUserWithDeleted() {
    return this.usersService.WithDelete();
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('nickName') nickName: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, process.env.HASH_SECRET);

    return this.usersService.create({
      email,
      hashedPassword,
      name,
      phoneNumber,
      nickName,
    });
  }

  // 로그인 검증하기
  @UseGuards(GqlAuthAccessGuard) // rest API에서 작동하는 부분이라 graphql이면 한번 걸러줘야함 => auth => gql-auth.guard.ts
  @Query(() => String)
  fetchHomeworkUser(
    @Context() context: any, //
  ) {
    console.log(context);
    // 유저 정보 꺼내 오기
    // console.log(context.req.user);
    // 유저정보로 findOne(where { id: context.req.user.id }) // 유저해서 user정보 가져오기
    return 'fetchUser가 실행되었습니다.';
  }

  // @Mutation(() => User)
  // async updateLoginUser(
  //   @Args('userId') userId: string,
  //   @Args('email') email: string,
  //   @Args('password') password: string,
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  // ) {
  //   // 1. 로그인 (이메일이 일치하는 유저를 DB에서 찾기)
  //   const user = await this.usersService.findOneUser({ email });

  //   // 2. 일치하는 유저가 없으면 에러 던지기
  //   if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

  //   // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면 에러 던지기
  //   const isAuth = await bcrypt.compare(password, user.password);
  //   if (!isAuth)
  //     throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

  //   const loginhass = await bcrypt.hash(updateUserInput.password, 10.2);

  //   return this.usersService.update({ userId, updateUserInput, loginhass });
  // }

  @Mutation(() => Boolean)
  deleteLoginUser(
    @Args('userId') userId: string, //
    @Context() context: IContext,
  ) {
    console.log(context.req);

    return false;
    // return this.usersService.delete({ userId });
  }

  // @Mutation(() => Boolean)
  // restoreUser(
  //   @Args('userId') userId: string, //
  // ) {
  //   return this.usersService.restore({ userId });
  // }
}
