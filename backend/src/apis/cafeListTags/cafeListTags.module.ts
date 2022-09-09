import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeListTagsResolver } from './cafeListTags.resolver';
import { CafeListTagsService } from './cafeListTags.service';
import { CafeListTag } from './entities/cafeListTag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeListTag, //
    ]),
  ],
  providers: [
    CafeListTagsResolver, //
    CafeListTagsService,
  ],
})
export class CafeListTagsModule {}
