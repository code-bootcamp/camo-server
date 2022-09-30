import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoardTagsResolver } from './freeBoardTags.resolver';
import { FreeBoardTagsService } from './freeBoardTags.service';
import { FreeBoardTag } from './entities/freeBoardTag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FreeBoardTag, //
    ]),
  ],
  providers: [
    FreeBoardTagsResolver, //
    FreeBoardTagsService,
  ],
})
export class FreeBoardTagsModule {}
