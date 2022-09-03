import { Injectable } from '@nestjs/common';
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
      checkBoard,
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
    const result = await this.commentRepository.delete({
      id: commentId,
    });

    return result.affected ? true : false;
  }
}
