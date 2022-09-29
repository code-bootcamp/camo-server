import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { FavoriteCafe } from './entities/favoriteCafe.entity';

@Injectable()
export class FavoriteCafesService {
  constructor(
    @InjectRepository(FavoriteCafe)
    private readonly favoriteCafeRepository: Repository<FavoriteCafe>,

    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly usersService: UsersService,
  ) {}

  async like({ userId, cafeBoardId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      const cafeBoard = await queryRunner.manager.findOne(CafeBoard, {
        where: { id: cafeBoardId },
      });

      if (!cafeBoard) throw new NotFoundException('존재하지 않는 피드입니다');

      const cafeLike = await this.favoriteCafeRepository
        .createQueryBuilder('cafeLike')
        .leftJoin('cafeLike.user', 'user')
        .leftJoin('cafeLike.cafeBoard', 'cafeBoard')
        .where({ user })
        .andWhere({ cafeBoard })
        .getOne();

      let updateLike: FavoriteCafe;
      let updateCafeList: CafeBoard;
      let likeStatus: boolean = null;

      if (!cafeLike?.isLike || !cafeLike) {
        updateLike = this.favoriteCafeRepository.create({
          ...cafeLike,
          user,
          cafeBoard,
          isLike: true,
        });

        updateCafeList = this.cafeBoardsRepository.create({
          ...cafeBoard,
          favoriteCafeCount: cafeBoard.favoriteCafeCount + 1,
        });

        likeStatus = true;
      } else if (cafeLike?.isLike) {
        updateLike = this.favoriteCafeRepository.create({
          ...cafeLike,
          user,
          cafeBoard,
          isLike: false,
        });

        updateCafeList = this.cafeBoardsRepository.create({
          ...cafeBoard,
          favoriteCafeCount: cafeBoard.favoriteCafeCount - 1,
        });

        likeStatus = false;
        await this.favoriteCafeRepository.delete({
          cafeBoard: cafeBoardId,
          user: userId,
        });
      }

      if (likeStatus === null)
        throw new NotAcceptableException('좋아요 토글에 실패했습니다');

      await queryRunner.manager.save(updateLike);
      await queryRunner.manager.save(updateCafeList);
      await queryRunner.commitTransaction();

      return likeStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findLike({ boardId }) {
    const board = await this.cafeBoardsRepository.find({
      where: { id: boardId },
    });
    return board[0];
  }

  async findByUserId({ userId }): Promise<number> {
    const result = await this.favoriteCafeRepository.find({
      where: { user: { id: userId } },
    });
    return result.length;
  }

  async findAll({ cafeBoardId }): Promise<FavoriteCafe[]> {
    return await this.favoriteCafeRepository.find({
      where: { cafeBoard: { id: cafeBoardId } },
      relations: ['cafeBoard', 'user'],
    });
  }

  async findUserLike({ userId, page }): Promise<FavoriteCafe[]> {
    return await this.favoriteCafeRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeBoard', 'user', 'cafeBoard.cafeListImage'],
      take: 6,
      skip: page ? (page - 1) * 6 : 0,
    });
  }
}
