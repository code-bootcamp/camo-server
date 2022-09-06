import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entites/user.entity';
import { Comment } from './entites/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  /** 댓글 개별 조회 */
  async find({ commentId }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['board', 'user'],
    });
    return result;
  }

  /** 댓글 모두 조회 */
  async findAll({ boardId }) {
    const result = await this.commentRepository.find({
      where: {
        board: { id: boardId },
      },
      relations: ['board', 'user'],
    });
    return result;
  }

  async create({ createCommentInput }) {
    const { userId, boardId, comment } = createCommentInput;

    const checkUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    const checkBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    return await this.commentRepository.save({
      user: checkUser,
      board: checkBoard,
      comment,
    });
  }

  async update({ commentId, userId, updateCommentInput }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    const checkUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    return await this.commentRepository.save({
      ...result,
      user: checkUser,
      ...updateCommentInput,
    });
  }

  async delete({ commentId }) {
    const result = await this.commentRepository.softDelete({
      id: commentId,
    });

    return result.affected ? true : false;
  }

  async deleteComment({ context, commentId }) {
    const userId = context.req.user.id;
    const comment = await this.find({ commentId });
    const commentUserId = comment.user['id'];
    if (commentUserId !== userId)
      throw new ConflictException('본인이 작성한 댓글만 지울 수 있습니다.');
    return this.delete({ commentId });
  }
}
