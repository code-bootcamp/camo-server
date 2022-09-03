import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeListsResolver } from './cafeLists.resolver';
import { CafeListsService } from './cafeLists.service';
import { CafeList } from './entities/cafeList.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeList, //
    ]),
  ],
  providers: [
    CafeListsResolver, //
    CafeListsService,
  ],
})
export class CafeListsModule {}
