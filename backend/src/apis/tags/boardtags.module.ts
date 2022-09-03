import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardTagsResolver } from './boardtags.resolver';
import { BoardTagsService } from './boardtags.service';
import { BoardTag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardTag, //
    ]),
  ],
  providers: [
    BoardTagsResolver, //
    BoardTagsService,
  ],
})
export class BoardTagModule {}
