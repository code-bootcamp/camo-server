import { Resolver } from '@nestjs/graphql';
import { CafeOwnersService } from './cafeOwners.service';

@Resolver()
export class CafeOwnersResolver {
  constructor(
    private readonly cafeOwnersService: CafeOwnersService, //
  ) {}
}
