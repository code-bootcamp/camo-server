import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FreeBoard } from '../freeboards/entities/freeBoard.entity';
import { User } from '../users/entites/user.entity';
import { favoriteBoard } from './entities/favoriteBoard.entity';

@Injectable()
export class FavoriteBoardsService {
  constructor(
    @InjectRepository(favoriteBoard)
    private readonly favoriteBoardsRepository: Repository<favoriteBoard>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(FreeBoard)
    private readonly freeBoardsRepository: Repository<FreeBoard>,

    private readonly dataSource: DataSource,
  ) {}

  async freeBoardlike({ userId, freeBoardId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      const freeBoard = await queryRunner.manager.findOne(FreeBoard, {
        where: { id: freeBoardId },
      });

      if (!freeBoard) throw new NotFoundException('존재하지 않는 게시글입니다');

      const boardLike = await this.favoriteBoardsRepository
        .createQueryBuilder('boardLike')
        .leftJoin('boardLike.user', 'user')
        .leftJoin('boardLike.freeBoard', 'freeBoard')
        .where({ user })
        .andWhere({ freeBoard })
        .getOne();

      let updateLike: favoriteBoard;
      let updateBoard: FreeBoard;
      let likeStatus: boolean = null;

      if (!boardLike?.isLike || !boardLike) {
        updateLike = this.favoriteBoardsRepository.create({
          ...boardLike,
          user,
          freeBoard,
          isLike: true,
        });

        updateBoard = this.freeBoardsRepository.create({
          ...freeBoard,
          likeCount: freeBoard.likeCount + 1,
        });

        likeStatus = true;
      } else if (boardLike?.isLike) {
        updateLike = this.favoriteBoardsRepository.create({
          ...boardLike,
          user,
          freeBoard,
          isLike: false,
        });

        updateBoard = this.freeBoardsRepository.create({
          ...freeBoard,
          likeCount: freeBoard.likeCount - 1,
        });

        likeStatus = false;
        await this.favoriteBoardsRepository.delete({
          freeBoard: freeBoardId,
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

  async finFreeBoarddAll({ freeBoardId }) {
    const result = await this.favoriteBoardsRepository.find({
      where: { freeBoard: { id: freeBoardId } },
      relations: ['freeBoard', 'user'],
    });
    return result;
  }
}
