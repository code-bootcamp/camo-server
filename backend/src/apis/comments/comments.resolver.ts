import { ConflictException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { Comment } from './entites/comment.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.create({ createCommentInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    // @Context() context: IContext, // 개발 완료후 변경
    @Args('userId') userId: string,
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    // const userId = context.req.user.id // 개발 완료 후 변경
    return this.commentService.update({
      commentId,
      userId,
      updateCommentInput,
    });
  }

  /** 댓글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentId') commentId: string, //
    @Context() context: IContext,
  ) {
    return this.commentService.deleteComment({ context, commentId });
  }

  /** 댓글 조회하기 */
  @Query(() => [Comment])
  async fetchComments(
    @Args('boardId') boardId: string, //
  ) {
    return await this.commentService.findAll({ boardId });
  }
}
