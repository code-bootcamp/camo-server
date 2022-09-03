import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    CommentsResolver, //
    CommentsService,
  ],
})
export class CommentsModule {}
