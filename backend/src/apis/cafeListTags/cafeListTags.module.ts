import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeListsResolver } from 'src/apis/cafeLists/cafeLists.resolver';
import { CafeListsService } from 'src/apis/cafeLists/cafeLists.service';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { CafeListTagsResolver } from './cafeListTags.resolver';
import { CafeListTagsService } from './cafeListTags.service';
import { CafeListTag } from './entities/cafeListTag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeListTag, //
      CafeList,
    ]),
  ],
  providers: [
    CafeListTagsResolver, //
    CafeListTagsService,
    CafeListsService,
    CafeListsResolver,
  ],
})
export class CafeListTagsModule {}
