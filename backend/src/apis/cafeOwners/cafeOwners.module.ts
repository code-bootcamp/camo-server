import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeOwnersResolver } from './cafeOwners.resolver';
import { CafeOwnersService } from './cafeOwners.service';
import { CafeOwner } from './entites/cafeOwner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeOwner, //
    ]),
  ],
  providers: [
    CafeOwnersResolver, //
    CafeOwnersService,
  ],
})
export class CafeOwnersModule {}
