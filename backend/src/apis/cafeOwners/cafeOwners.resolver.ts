import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { CafeOwnersService } from './cafeOwners.service';
// import { CreateCafeOwnerInput } from './dto/createCafeOwner.input';
// import { CafeOwner } from './entities/cafeOwner.entity';

@Resolver()
export class CafeOwnersResolver {
  constructor() {} // private readonly cafeOwnersService: CafeOwnersService, //
  // @Mutation(() => CafeOwner)
  // async createCafeOwner(
  // @Args('createCafeOwnerInput') createCafeOwnerInput: CreateCafeOwnerInput,
  // ) {
  //   // return this.cafeOwnersService.create({ createCafeOwnerInput });
  // }
}
