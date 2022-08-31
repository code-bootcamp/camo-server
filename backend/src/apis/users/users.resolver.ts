import { UnprocessableEntityException } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUser.input';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entites/user.entity';

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
  fetchLoginUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.findOne({ userId });
  }

  @Query(() => [User])
  fetchUserWithDeleted() {
    return this.usersService.WithDelete();
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('phoneNumber') phoneNumber: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);

    return this.usersService.create({
      email,
      hashedPassword,
      name,
      phoneNumber,
    });
  }

  @Mutation(() => User)
  async updateLoginUser(
    @Args('userId') userId: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    // 1. 로그인 (이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findOneUser({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면 에러 던지기
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    const loginhass = await bcrypt.hash(updateUserInput.password, 10.2);

    return this.usersService.update({ userId, updateUserInput, loginhass });
  }

  @Mutation(() => Boolean)
  deleteLoginUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.delete({ userId });
  }

  @Mutation(() => Boolean)
  restoreUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.restore({ userId });
  }
}
