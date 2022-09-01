import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthsService } from './auths.service';
import { IContext } from 'src/commons/type/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authsService: AuthsService) {}

  @Mutation(() => String)
  async loginUser(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    return this.authsService.getUserLogin({ email, password, context });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: IContext, //
  ) {
    return this.authsService.getLogout({ context });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }
}
