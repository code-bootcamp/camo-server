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

  async create({ user, createCommentInput }) {
    const { boardId, comment } = createCommentInput;
    const checkUser = await this.userRepository.findOne({
      where: { email: user },
    });
    const checkBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    return await this.commentRepository.save({
      user: { id: checkUser.id },
      board: { id: checkBoard.id },
      comment,
    });
  }

  async update({ commentId, userId, updateCommentInput }) {
    const checkComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!checkComment)
      throw new ConflictException('해당 댓글을 찾을 수 없습니다.');

    const checkUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (checkUser.id !== userId)
      throw new ConflictException('댓글 작성자만 접근이 가능합니다.');

    return await this.commentRepository.save({
      ...checkComment,
      user: checkUser,
      ...updateCommentInput,
    });
  }

  async deleteComment({ context, commentId }) {
    const email = context.req.user.email;
    const comment = await this.find({ commentId });
    const commentUserEmail = comment.user.email;

    if (commentUserEmail !== email)
      throw new ConflictException('본인이 작성한 댓글만 접근이 가능합니다.');
    const result = await this.commentRepository.softDelete({ id: commentId });

    return result.affected ? true : false;
  }
}
