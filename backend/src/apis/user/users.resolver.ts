import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserService } from './users.service';
import * as bcrypt from 'bcrypt';
import { User } from './entites/user.entity';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Query(() => String)
  fetchUser(
    @Context() context: any, //
  ) {
    // 유저 정보 꺼내오기
    console.log(context.req.user);
    console.log('fetchUser 실행 완료');
    return 'fetchUser가 실행되었습니다.';
  }

  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  @Query(() => User)
  fetchLoginUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.findOne({ userId });
  }

  @Query(() => [User])
  fetchUserWithDeleted() {
    return this.userService.WithDelete();
  }

  @Mutation(() => User)
  async createUser(
    @Args('userEmail') userEmail: string, //
    @Args('password') password: string, //
    @Args('name') name: string,
    @Args('phoneNumber') phoneNumber: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);

    return this.userService.create({
      userEmail,
      hashedPassword,
      name,
      phoneNumber,
    });
  }

  @Mutation(() => User)
  async updateLoginUser(
    @Args('userId') userId: string,
    @Args('userEmail') userEmail: string,
    @Args('password') password: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    // 1. 로그인 (이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.userService.findOneUser({ userEmail });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면 에러 던지기
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    const loginhass = await bcrypt.hash(updateUserInput.password, 10.2);

    return this.userService.update({ userId, updateUserInput, loginhass });
  }

  @Mutation(() => Boolean)
  deleteLoginUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.delete({ userId });
  }

  @Mutation(() => Boolean)
  restoreUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.restore({ userId });
  }
}