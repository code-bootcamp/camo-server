import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entites/user.entity';
import { favoriteBoard } from './entities/favoriteBoard.entity';

@Injectable()
export class FavoriteBoardsService {
  constructor(
    @InjectRepository(favoriteBoard)
    private readonly favoriteBoardsRepository: Repository<favoriteBoard>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,

    private readonly dataSource: DataSource,
  ) {}

  async like({ userId, boardId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      const board = await queryRunner.manager.findOne(Board, {
        where: { id: boardId },
      });

      if (!board) throw new NotFoundException('존재하지 않는 피드입니다');

      const boardLike = await this.favoriteBoardsRepository
        .createQueryBuilder('boardLike')
        .leftJoin('boardLike.user', 'user')
        .leftJoin('boardLike.board', 'board')
        .where({ user })
        .andWhere({ board })
        .getOne();

      let updateLike: favoriteBoard;
      let updateBoard: Board;
      let likeStatus: boolean = null;

      if (!boardLike?.isLike || !boardLike) {
        updateLike = this.favoriteBoardsRepository.create({
          ...boardLike,
          user,
          board,
          isLike: true,
        });

        updateBoard = this.boardsRepository.create({
          ...board,
          likeCount: board.likeCount + 1,
        });

        likeStatus = true;
      } else if (boardLike?.isLike) {
        updateLike = this.favoriteBoardsRepository.create({
          ...boardLike,
          user,
          board,
          isLike: false,
        });

        updateBoard = this.boardsRepository.create({
          ...board,
          likeCount: board.likeCount - 1,
        });

        likeStatus = false;
        await this.favoriteBoardsRepository.delete({
          board: boardId,
          user: userId,
        });
      }

      if (likeStatus === null)
        throw new NotAcceptableException('좋아요 토글에 실패했습니다');

      await queryRunner.manager.save(updateLike);
      await queryRunner.manager.save(updateBoard);
      await queryRunner.commitTransaction();

      return likeStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({ boardId }) {
    const result = await this.favoriteBoardsRepository.find({
      where: { board: { id: boardId } },
      relations: ['board', 'user'],
    });
    return result;
  }
}
